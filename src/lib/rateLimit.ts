// Minimal in-memory rate limiter. Good enough for this app's scale (a
// single Render instance, no Redis) — it resets on redeploy/restart and
// doesn't share state across instances, but that's an acceptable tradeoff
// here over adding external infra for a small 1:1 tutoring platform. If this
// ever runs on more than one instance, swap this for a shared store (Redis,
// Upstash, etc.) instead of extending the Map.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Keep the map from growing without bound if it's ever hit by many distinct
// keys (e.g. many different IPs) over a long-running process.
const MAX_TRACKED_KEYS = 20_000;

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();

  if (buckets.size > MAX_TRACKED_KEYS) {
    buckets.clear();
  }

  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= max) return false;
  bucket.count += 1;
  return true;
}

export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
