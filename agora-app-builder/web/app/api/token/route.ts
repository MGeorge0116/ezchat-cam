// app/api/token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession, type Session } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  // Make the type explicit so TS doesn't infer {}:
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Token Server Authentication only supports SDK integration. Please sign in." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const channelName = (searchParams.get("channel") || "").toLowerCase();
  const roleParam = (searchParams.get("role") || "publisher").toLowerCase(); // "publisher" | "subscriber"

  // username is our custom field; fall back to name/email localpart.
  const username = String(
    (session.user as any).username ??
      session.user.name ??
      (session.user.email ? session.user.email.split("@")[0] : "")
  ).toLowerCase();

  if (!channelName || channelName !== username) {
    return NextResponse.json({ error: "Channel must equal your username." }, { status: 403 });
  }

  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE!;
  const expiresIn = Number(process.env.AGORA_TOKEN_EXPIRES || 3600);
  if (!appId || !appCertificate) {
    return NextResponse.json({ error: "Agora not configured." }, { status: 500 });
  }

  const { RtcTokenBuilder, RtcRole } = await import("agora-access-token");
  const now = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = now + expiresIn;
  const role = roleParam === "subscriber" ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    0,
    role,
    privilegeExpiredTs
  );

  return NextResponse.json({ token, appId, expiresIn });
}
