// App Router API route for generating an RTM token

import { NextResponse } from "next/server";
// Use the default export from "agora-token" and destructure builders from it.
import agoraToken from "agora-token";
const { RtmTokenBuilder } = agoraToken as {
  RtmTokenBuilder: {
    buildToken: (
      appId: string,
      appCertificate: string,
      userId: string,
      expireTimestamp: number
    ) => string;
  };
};

// Ensure we're in Node.js runtime (required by crypto used inside the builder)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const APP_ID = process.env.AGORA_APP_ID!;
const APP_CERT = process.env.AGORA_APP_CERTIFICATE!;

// Clamp helper
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export async function GET(req: Request) {
  try {
    if (!APP_ID || !APP_CERT) {
      return NextResponse.json(
        { error: "Missing AGORA_APP_ID or AGORA_APP_CERTIFICATE env vars" },
        { status: 500 }
      );
    }

    const url = new URL(req.url);
    // Accept either ?userId=... or ?uid=... for convenience
    const userId = (url.searchParams.get("userId") || url.searchParams.get("uid") || "").trim();
    if (!userId) {
      return NextResponse.json({ error: "Missing userId (or uid) query param" }, { status: 400 });
    }

    // Optional: ?expiresIn=3600 (seconds). Default 1 hour. Clamp to [60, 7 days].
    const expiresInRaw = url.searchParams.get("expiresIn");
    const expiresIn = clamp(Number(expiresInRaw ?? 3600) || 3600, 60, 7 * 24 * 3600);

    const now = Math.floor(Date.now() / 1000);
    const expireTs = now + expiresIn;

    // With AccessToken2 the RTM token builder no longer needs a role
    const token = RtmTokenBuilder.buildToken(APP_ID, APP_CERT, userId, expireTs);

    return NextResponse.json({ token, userId, expiresIn }, { status: 200 });
  } catch (err) {
    // Avoid leaking internals; return generic error
    return NextResponse.json({ error: "Failed to generate RTM token" }, { status: 500 });
  }
}
