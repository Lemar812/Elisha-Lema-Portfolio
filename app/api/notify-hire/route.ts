import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { clientIp, createRateLimiter } from "@/studio/lib/rateLimit";

const limiter = createRateLimiter({
  prefix: "hire-interest",
  perMinute: 3,
  dailyCeiling: 20,
});

// Optional owner notification matching the reference terminal's hire interaction.
// Disabled until the owner deliberately enables it; no visitor message is sent.
export async function POST(req: NextRequest) {
  if (
    process.env.HIRE_NOTIFICATIONS_ENABLED !== "true" ||
    !process.env.RESEND_API_KEY ||
    !process.env.CONTACT_FROM_EMAIL
  )
    return NextResponse.json({ enabled: false });
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin)
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if ((await limiter.limit(clientIp(req))).tooMany)
    return NextResponse.json({ error: "Please try later" }, { status: 429 });
  try {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.CONTACT_FROM_EMAIL,
      to: "elishalema12@gmail.com",
      subject: "Portfolio interest: hire elisha",
      text: `A visitor used the “hire elisha” command in your Elisha Creatives portfolio at ${new Date().toISOString()}. No contact details were collected.`,
    });
    if (error) throw new Error("Delivery failed");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Notification unavailable" },
      { status: 502 },
    );
  }
}
