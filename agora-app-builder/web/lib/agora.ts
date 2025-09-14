// Tiny helper to fetch an Agora RTM token from our /api/rtm route.

export type AgoraTokenResponse = {
  token: string;
  userId: string;
  expiresIn: number; // seconds
};

function apiUrl(path: string): string {
  if (typeof window !== "undefined") return path; // browser
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return `${base}${path}`;
}

/**
 * Get an RTM token for the given userId.
 * Default expiry is 3600 seconds (1 hour).
 */
export async function getToken(userId: string, expiresIn = 3600): Promise<string> {
  const url = apiUrl(
    `/api/rtm?userId=${encodeURIComponent(userId)}&expiresIn=${encodeURIComponent(
      String(expiresIn)
    )}`
  );

  const res = await fetch(url, {
    method: "GET",
    headers: { accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Agora token (${res.status})`);
  }

  const data = (await res.json()) as Partial<AgoraTokenResponse>;
  if (!data?.token) {
    throw new Error("Invalid token response");
  }
  return data.token;
}

// Optional alias if you prefer being explicit elsewhere.
export const getRtmToken = getToken;
