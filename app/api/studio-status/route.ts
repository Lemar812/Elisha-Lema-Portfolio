import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export function GET() {
  return NextResponse.json({
    email: !!(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL),
    ai: !!process.env.ANTHROPIC_API_KEY,
  });
}
