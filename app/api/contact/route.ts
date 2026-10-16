import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
const attempts = new Map<string, number[]>();
export async function POST(req: NextRequest) {
  if (Number(req.headers.get("content-length") || 0) > 16000)
    return NextResponse.json({ error: "Message too long" }, { status: 413 });
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }
  const { name, email, company = "", subject, message } = body ?? {};
  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.length > 100 ||
    typeof email !== "string" ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof subject !== "string" ||
    subject.trim().length < 5 ||
    subject.length > 200 ||
    typeof message !== "string" ||
    message.trim().length < 20 ||
    message.length > 5000 ||
    typeof company !== "string" ||
    company.length > 200
  )
    return NextResponse.json(
      { error: "Please check the form fields." },
      { status: 400 },
    );
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_FROM_EMAIL)
    return NextResponse.json(
      { error: "Direct sending is unavailable. Please use email or WhatsApp." },
      { status: 503 },
    );
  const ip =
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "local";
  const now = Date.now();
  for (const [key, hits] of attempts)
    if (!hits.some((t) => now - t < 600000)) attempts.delete(key);
  const hits = (attempts.get(ip) || []).filter((t) => now - t < 600000);
  if (hits.length >= 3)
    return NextResponse.json(
      { error: "Please wait before sending another message." },
      { status: 429 },
    );
  attempts.set(ip, [...hits, now]);
  try {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.CONTACT_FROM_EMAIL,
      to: "elishalema12@gmail.com",
      replyTo: email,
      subject: `Portfolio: ${subject}`,
      text: `From: ${name}\nEmail: ${email}\nOrganisation: ${company}\n\n${message}`,
    });
    if (error) throw new Error("Delivery failed");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      {
        error: "Your message could not be sent. Please use email or WhatsApp.",
      },
      { status: 502 },
    );
  }
}
