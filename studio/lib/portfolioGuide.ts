import { works } from "@/data/works";
import { projectStories } from "@/data/projectStories";
import { process } from "@/data/about";
import type { AppType } from "@/studio/shared/types";

export type GuideAction = { label: string; app: AppType; workId?: string };
export type GuideReply = { text: string; projects: string[]; followUps: string[]; actions: GuideAction[] };
type Turn = { role: string; content: string };
const contact: GuideAction = { label: "Open Contact", app: "contact" };
const workAction: GuideAction = { label: "Explore all creatives", app: "projects" };
const normal = (s: string) => s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").trim();

/** Deterministic portfolio guidance. Context comes only from visitor turns,
 * never from generated claims; project cards always refer to the real catalog. */
export function getGuideReply(question: string, history: Turn[] = []): GuideReply {
  const q = normal(question);
  const previous = [...history].reverse().filter((m) => m.role === "user" && normal(m.content) !== q);
  const followUp = /^(tell me more|more|examples|show me examples|show me work|why|what about that|yes|show related work)$/.test(q);
  const topic = followUp ? `${normal(previous[0]?.content ?? "")} ${q}` : q;
  const reply = (text: string, projects: string[] = [], followUps = ["How does the process work?", "How can I contact Elisha?"], actions: GuideAction[] = [workAction, contact]): GuideReply => ({ text, projects, followUps, actions });
  if (followUp && /examples|show.*work/.test(q)) {
    const ids = /website|web|development|build/.test(topic) ? ["work-19"] : /poster|promotion|campaign|print/.test(topic) ? ["work-8", "work-21"] : /brand|logo|identity/.test(topic) ? ["work-1", "work-2"] : ["work-1", "work-19"];
    return reply(ids.map((id) => { const work = works.find((item) => item.id === id)!; return `${work.title}\n${work.description}`; }).join("\n\n") + "\n\nOpen a project below to see the work in detail.", ids, ["How does the process work?", "How can I contact Elisha?"]);
  }
  if (/\b(bookings?|enquiries|information site|store and manage data)\b/.test(q))
    return reply("That helps define the website’s scope. An enquiry form collects requests for you to respond to; a booking system may also need availability, confirmations and payments. An information site can start with clear services and a contact route.\n\nUse Project brief to describe the customer’s steps and what you need to manage afterwards. Elisha can then confirm the right implementation and scope.", ["work-19"], ["How much would it cost?", "How does the process work?"], [contact]);
  if (/\b(price|pricing|cost|budget|quote|charge|rate|availability|available|deadline|how long)\b/.test(q))
    return reply("A reliable quote needs a clear scope. Elisha hasn’t published fixed prices or a current availability calendar, so I can’t promise a price or delivery date.\n\nTell him what you need, who it is for, and your target date. The Project brief tab helps you organise those details before you review the enquiry in Contact.", [], ["Which service fits my project?", "How does the process work?"], [contact]);
  if (/\b(contact|email|whatsapp|hire|reach|looking for)\b/.test(q))
    return reply("You can contact Elisha at elishalema12@gmail.com or on WhatsApp at +255674175613. He works with individual business owners, startups and established organisations on design and websites.\n\nShare your business, the work you have in mind, and any timing or budget preferences. You can prepare a brief here first; nothing is sent automatically.", [], ["Which service fits my project?", "Show me relevant work"], [contact]);
  if (/\b(process|approach|steps|how do you work|how does.*work)\b/.test(q))
    return reply(process.map((p, i) => `${i + 1}. ${p.title} — ${p.text}`).join("\n\n"), [], ["Show me website work", "Show me brand identities"], [{ label: "Explore services", app: "services" }, contact]);
  if (/\b(plp|training|flutter|education|certificate|qualification)\b/.test(q))
    return reply(`Elisha completed Power Learn Project’s 16-week Software Development programme in May 2024. It covered Python, web technologies, database management and soft skills, with a specialisation in Dart and Flutter.\n\nThat training built a programming foundation; his current development focus is websites, alongside visual design.`, [], ["What did he do at St Jude?", "What does he build today?"], [{ label: "Read the résumé", app: "resume" }, { label: "Explore his journey", app: "about-me" }]);
  if (/\b(st jude|esl|intern|typing|community service)\b/.test(q))
    return reply(`Elisha completed the Beyond St Jude’s Community Service Year Program in the ESL & Typing Division, June 2025–September 2026.\n\nHe worked mainly in computer labs, integrating and supporting the school’s licensed Rosetta Stone Classroom, eTestify and EdClub systems used for English and typing practice.`, [], ["Tell me about his training", "How did Elisha start?"], [{ label: "Read the résumé", app: "resume" }]);
  const shortName = topic.replace(/^(tell me about|show me|explain|more about) /, "");
  const partial = shortName.length >= 4 ? works.filter((w) => normal(w.title).includes(shortName)) : [];
  const named = works.find((w) => topic.includes(normal(w.title)) || topic === normal(w.id)) ?? (partial.length === 1 ? partial[0] : undefined);
  if (named) {
    const story = projectStories[named.id];
    return reply(`${named.title}\n\n${named.description}${story ? `\n\nDesign focus: ${story.focus}` : ""}\n\nOpen the project to inspect the artwork and the decisions behind it. I don’t have verified performance metrics for this work.`, [named.id], ["How does the process work?", "I need something similar"], [{ label: "Open this creative", app: "projects", workId: named.id }, contact]);
  }
  if (/\b(brand meaning|elisha creatives mean|signature|why elisha|what does ec|logo mean)\b/.test(q))
    return reply("Elisha Creatives brings Elisha’s design and development work under one recognisable identity. ‘Creatives’ means the products of his creative practice; Elisha is his real name.\n\nThe ‘e’ is his signature, and ‘ec’ represents Elisha Creatives. The brand connects both sides of his work rather than separating design from development.", [], ["How did Elisha start?", "Show me brand identities"], [{ label: "Meet Elisha", app: "about-me" }]);
  if (/\b(who are you|are you elisha|are you human)\b/.test(q))
    return reply("I’m the automated guide to Elisha Creatives, not Elisha personally. I can help you explore verified portfolio information and prepare a project brief. Personal answers, prices and availability come directly from Elisha.", [], ["Meet Elisha", "Find relevant work"], [contact]);
  if (/\b(who is elisha|about elisha|meet elisha|journey|story|background|experience|how did.*start)\b/.test(q) && !/\b(project|business|website|brand)\b/.test(q))
    return reply("Elisha Lema is a designer and developer based in Tanzania, freelancing since 2024. Programming came first in secondary school, supported by a tech community; design followed.\n\nToday, he combines visual design with frontend website development and the backend integrations a project needs. Elisha Creatives gives that combined practice a clear identity.", [], ["Tell me about his training", "What did he do at St Jude?", "What does Elisha Creatives mean?"], [{ label: "Meet Elisha", app: "about-me" }, { label: "Read the résumé", app: "resume" }]);
  if (/\b(websites?|web|frontend|backend|development|develop|build|database|mobile app)\b/.test(topic))
    return reply("For a website, Elisha’s main focus is the visible experience: layout, navigation and responsive frontend development. He also works on database and backend integration when a project needs it.\n\nNatureWiseTours is the website example in this collection. For your project, the useful first distinction is whether you need an information site, enquiries or bookings, or features that store and manage data. Which is closest to your idea?", ["work-19"], ["I need a business website", "I need a logo as well", "How does the process work?"], [{ label: "Explore website services", app: "services" }, contact]);
  if (/\b(posters?|banners?|brochures?|campaign|promotion|promotional|social media|print)\b/.test(topic))
    return reply("For a campaign or promotion, the work starts with a clear message, the audience and where the design will appear. Elisha’s collection includes posters, banners, brochures and a video thumbnail.\n\nThe A&B Accessories material shows related promotional pieces. Lemosho is a travel-poster example. Which format are you planning, and what should someone do after seeing it?", ["work-8", "work-21"], ["How does the process work?", "How much would it cost?"], [{ label: "Explore services", app: "services" }, contact]);
  if (/\b(logos?|brand|identity|identities)\b/.test(topic))
    return reply("A logo gives the business a recognisable mark; a broader identity helps its visual presentation feel consistent. Elisha’s work includes logos and supporting promotional design.\n\nKili Expeditions and Macha Stores are two identity examples to explore. Do you need a new identity, or help bringing existing materials together?", ["work-1", "work-2"], ["I need promotional materials", "I need a website as well", "How much would it cost?"], [{ label: "Explore design services", app: "services" }, contact]);
  if (/\b(services?|skills?|design|fit|recommend|similar|not sure|business)\b/.test(topic))
    return reply("Let’s start with the outcome you need.\n\n• A recognisable business → logo and visual identity.\n• A clearer online presence → website design and development.\n• A campaign people can understand → posters, banners and promotional materials.\n\nYou can combine design and development in one enquiry. Which outcome matters most to you?", [], ["I need a brand identity", "I need a website", "I need promotional materials"], [{ label: "Compare services", app: "services" }]);
  if (/\b(work|projects?|portfolio|creatives?|examples|relevant)\b/.test(topic))
    return reply(`There are ${works.length} creatives in the current collection. A useful starting pair is Kili Expeditions for visual identity and NatureWiseTours for website work.\n\nIf you tell me the kind of work you need, I can narrow this to logos, promotional design or websites.`, ["work-1", "work-19"], ["Show me brand identities", "Show me promotional design", "Show me website work"]);
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|thanks|thank you)$/.test(q))
    return reply("Welcome. I can help you find relevant work, understand Elisha’s services or turn an idea into a project brief. What would be most useful today?", [], ["Find relevant work", "Which service fits my project?", "Meet Elisha"], []);
  return reply("I don’t have a verified answer to that in the portfolio. I can help with Elisha’s work, services, background and project planning. For a personal or project-specific answer, contact Elisha directly.\n\nWould you like to explore the work or prepare a brief for him?", [], ["Find relevant work", "Which service fits my project?"], [contact]);
}

