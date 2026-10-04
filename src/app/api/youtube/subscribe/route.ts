import { site } from "@/content";
import { hub, sameSecret } from "@/lib/websub";
import { feedUrl } from "@/lib/youtube";

// Subscribes (and renews) the site to new-video notifications for the channel.
// Hub subscriptions expire, so a Vercel Cron job calls this daily (vercel.json),
// authenticated with CRON_SECRET, which Vercel sends as a bearer token.

const LEASE_SECONDS = 10 * 24 * 3600;

export async function GET(request: Request) {
  const cron = process.env.CRON_SECRET;
  const secret = process.env.WEBSUB_SECRET;
  if (!cron || !secret) {
    return Response.json({ error: "Set WEBSUB_SECRET and CRON_SECRET" }, { status: 503 });
  }
  if (!sameSecret(request.headers.get("authorization") ?? "", `Bearer ${cron}`)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const res = await fetch(hub, {
    method: "POST",
    cache: "no-store",
    body: new URLSearchParams({
      "hub.mode": "subscribe",
      "hub.topic": feedUrl,
      "hub.callback": `${site.url}/api/youtube`,
      "hub.verify": "async",
      "hub.secret": secret,
      "hub.lease_seconds": String(LEASE_SECONDS),
    }),
  });
  // 202: accepted; the hub now confirms with a GET to /api/youtube.
  return Response.json({ hub: res.status, accepted: res.status === 202 || res.status === 204 });
}
