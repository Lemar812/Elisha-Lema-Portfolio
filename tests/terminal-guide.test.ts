import { test } from "node:test";
import assert from "node:assert/strict";
import { commandNames, resolveCommand, getCompletions, OPEN_APP_ALIASES, type CommandResult } from "../studio/lib/terminalCommands";
import { works } from "../data/works";
import { getGuideReply } from "../studio/lib/portfolioGuide";
import { useChatStore } from "../studio/store/chatStore";
import { sendGuideQuestion, stopGuideResponse, newGuideConversation } from "../studio/lib/chatSession";
import { useProjectBriefStore, formatBrief } from "../studio/store/projectBriefStore";
const context = { currentTheme: "dark" as const, openWindow: () => {}, toggleTheme: () => { throw new Error("Handlers should describe actions, not run them"); } };
const run = (input: string) => { const command = resolveCommand(input); assert.ok(command, input); return command.handler(command.args, context); };

test("every terminal command returns a valid documented result without side effects", () => {
  const help = (run("help") as string[]).join(" ");
  for (const name of commandNames) {
    assert.match(help, new RegExp(`\\b${name}\\b`), `${name} missing from help`);
    const result = run(name);
    assert.ok(Array.isArray(result) ? result.every((line) => typeof line === "string") : ["action", "special"].includes(result.type), name);
  }
});
test("terminal parsing preserves case and quoted arguments; inherited keys are not commands", () => {
  assert.deepEqual(run('ECHO "Hello Elisha" Tanzania'), ["Hello Elisha Tanzania"]);
  assert.deepEqual(run('ask Can You Build My Website?'), { type: "action", action: "openAssistant", payload: "Can You Build My Website?" });
  for (const name of ["constructor", "toString", "__proto__", "", "missing"]) assert.equal(resolveCommand(name), null);
  assert.ok(Array.isArray(run("open constructor")));
});
test("every app alias routes correctly, including mixed case", () => {
  for (const [alias, app] of Object.entries(OPEN_APP_ALIASES)) assert.deepEqual(run(`OPEN ${alias.toUpperCase()}`), { type: "action", action: "openWindow", payload: app });
});
test("project search, ambiguous results, and every project ID are accurate", () => {
  for (const w of works) assert.deepEqual(run(`project ${w.id}`), { type: "action", action: "openProject", payload: w.id });
  assert.match((run("projects") as string[])[0], new RegExp(`${works.length} creatives`));
  assert.match((run("find website") as string[]).join(" "), /NatureWiseTours/);
  assert.match((run("project Accessories") as string[])[0], /More than one/);
  assert.match((run("find nowhere123") as string[])[0], /No creatives/);
  assert.deepEqual(run('project "Kili Expeditions"'), { type: "action", action: "openProject", payload: "work-1" });
});
test("theme, special commands and usage errors report meaningful results", () => {
  assert.match((run("theme") as string[])[0], /Current appearance: dark/);
  assert.deepEqual(run("theme LIGHT"), { type: "action", action: "toggleTheme" });
  assert.match((run("theme dark light") as string[])[0], /Usage/);
  assert.match((run("hire nobody") as string[])[0], /Usage/);
  const expected: Record<string, CommandResult> = { tour: { type: "action", action: "startTour" }, exit: { type: "action", action: "closeTerminal" }, brief: { type: "action", action: "planProject" }, history: { type: "action", action: "history" }, matrix: { type: "special", id: "matrix" }, "hire elisha": { type: "special", id: "hire" } };
  for (const [command, result] of Object.entries(expected)) assert.deepEqual(run(command), result);
  assert.ok((run("cowsay Hello") as string[])[2].includes("\\"));
  assert.ok(getCompletions("open res").candidates.includes("resume"));
  assert.ok(getCompletions("theme l").candidates.includes("light"));
  assert.deepEqual(getCompletions("ask What"), { ghost: "", candidates: [], commonPrefix: "" });
});
test("guide responds specifically to services and keeps follow-up context", () => {
  assert.deepEqual(getGuideReply("I need a website").projects, ["work-19"]);
  assert.deepEqual(getGuideReply("Show me examples", [{ role: "user", content: "I need a website" }]).projects, ["work-19"]);
  assert.ok(getGuideReply("I need a logo").projects.includes("work-1"));
  assert.ok(getGuideReply("I need a poster").projects.includes("work-8"));
  assert.deepEqual(getGuideReply("tell me about Kili").projects, ["work-1"]);
  assert.match(getGuideReply("How much will this cost?").text, /hasn’t published fixed prices/);
  assert.match(getGuideReply("Who is the president?").text, /don’t have a verified answer/);
  assert.match(getGuideReply("What did he do at St Jude?").text, /September 2026/);
  assert.match(getGuideReply("PLP training").text, /16-week/);
  assert.match(getGuideReply("How does the process work?").text, /1\. Imagine/);
});
test("guide suggestions only point to real project IDs", () => {
  for (const q of ["work", "website", "logo", "poster", "services", "about", ...works.map((w) => w.title)]) {
    const r = getGuideReply(q);
    assert.ok(r.text.length > 50);
    for (const id of r.projects) assert.ok(works.some((w) => w.id === id));
    for (const a of r.actions) if (a.workId) assert.ok(works.some((w) => w.id === a.workId));
  }
});
test("local conversations work without network and can be reset", async () => {
  newGuideConversation();
  await sendGuideQuestion("I need a website", false);
  assert.equal(useChatStore.getState().messages.length, 2);
  await sendGuideQuestion("Show me examples", false);
  assert.match(useChatStore.getState().messages.at(-1)!.content, /NatureWiseTours/);
  assert.equal(useChatStore.getState().status, "idle");
  newGuideConversation();
  assert.equal(useChatStore.getState().messages.length, 0);
});
test("failed live requests fall back, and stopped stale requests cannot overwrite newer work", async () => {
  const original = globalThis.fetch;
  try {
    newGuideConversation();
    globalThis.fetch = async () => new Response("", { status: 503 });
    await sendGuideQuestion("website", true);
    assert.equal(useChatStore.getState().mode, "guide");
    assert.match(useChatStore.getState().notice, /unavailable/);
    let resolve!: (r: Response) => void;
    globalThis.fetch = () => new Promise<Response>((r) => { resolve = r; });
    const pending = sendGuideQuestion("logo", true);
    stopGuideResponse();
    await sendGuideQuestion("training", false);
    resolve(new Response("stale reply"));
    await pending;
    assert.doesNotMatch(useChatStore.getState().messages.at(-1)!.content, /stale reply/);
  } finally { globalThis.fetch = original; newGuideConversation(); }
});
test("project brief preserves exact visitor details and prepares a one-time handoff", () => {
  const s = useProjectBriefStore.getState();
  s.reset();
  s.update({ kind: "Website", business: "Acme Tanzania", goal: "Help visitors enquire about our tours." });
  const draft = useProjectBriefStore.getState().draft;
  assert.match(formatBrief(draft), /Acme Tanzania/);
  assert.match(formatBrief(draft), /Budget preference: To discuss/);
  s.prepare();
  assert.equal(useProjectBriefStore.getState().pending?.subject, "Website enquiry");
  s.consume();
  assert.equal(useProjectBriefStore.getState().pending, null);
  assert.equal(useProjectBriefStore.getState().draft.business, "Acme Tanzania");
  s.reset();
});
