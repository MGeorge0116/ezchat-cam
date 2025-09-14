import Redis from "ioredis";

let redis: Redis | null = null;

/**
 * Returns a singleton ioredis client.
 * - Supports REDIS_URL or UPSTASH_REDIS_URL
 * - Enables TLS automatically for common cloud URLs or rediss://
 */
export function getRedis(): Redis {
  if (redis) return redis;

  const raw =
    process.env.REDIS_URL ??
    process.env.UPSTASH_REDIS_URL ??
    "redis://localhost:6379";

  const url =
    raw.startsWith("redis://") || raw.startsWith("rediss://")
      ? raw
      : `redis://${raw}`;

  const needsTLS =
    url.startsWith("rediss://") ||
    url.includes(".redns.redis-cloud.com") ||
    url.includes(".upstash.io");

  // Use a branch so TypeScript picks the correct ioredis constructor overload
  redis = needsTLS
    ? new Redis(url, { tls: { rejectUnauthorized: false } })
    : new Redis(url);

  return redis;
}

/**
 * Store JSON at a key. Optionally set TTL in seconds.
 */
export async function setJSON<T>(
  key: string,
  value: T,
  ttlSeconds?: number
): Promise<void> {
  const client = getRedis();
  const payload = JSON.stringify(value);
  if (typeof ttlSeconds === "number" && Number.isFinite(ttlSeconds)) {
    await client.set(key, payload, "EX", Math.max(1, Math.floor(ttlSeconds)));
  } else {
    await client.set(key, payload);
  }
}

/**
 * Retrieve JSON from a key. Returns null if missing or invalid JSON.
 */
export async function getJSON<T = unknown>(key: string): Promise<T | null> {
  const client = getRedis();
  const raw = await client.get(key);
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Delete a key.
 */
export async function del(key: string): Promise<number> {
  const client = getRedis();
  return client.del(key);
}
