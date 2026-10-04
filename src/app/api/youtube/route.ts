import { revalidatePath, revalidateTag } from "next/cache";
import { after } from "next/server";
import { youtube } from "@/content";
import { validSignature } from "@/lib/websub";
import { feedUrl, videosTag } from "@/lib/youtube";

// Callback for YouTube's WebSub hub: it calls this when a video is published,
// updated or deleted, and the home page refreshes its video list.

export const maxDuration = 60; // room to wait for the public feed to catch up

/** The hub confirming a subscription (or its renewal): echo the challenge for our own channel only. */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams;
  const mode = q.get("hub.mode");
  const challenge = q.get("hub.challenge");
  if ((mode === "subscribe" || mode === "unsubscribe") && q.get("hub.topic") === feedUrl && challenge) {
    return new Response(challenge, { headers: { "Content-Type": "text/plain" } });
  }
  return new Response("Not found", { status: 404 });
}

/** A notification. WebSub says to acknowledge with 2xx even when ignoring it. */
export async function POST(request: Request) {
  const secret = process.env.WEBSUB_SECRET;
  const body = Buffer.from(await request.arrayBuffer());
  if (!secret || !validSignature(body, request.headers.get("x-hub-signature"), secret)) {
    return new Response(null, { status: 204 });
  }
  const xml = body.toString("utf8");
  if (!xml.includes(youtube.channelId)) return new Response(null, { status: 204 });

  const videoId = xml.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/)?.[1];
  after(async () => {
    // The notification can arrive before the public feed lists the video: wait for it.
    if (videoId) await untilInFeed(videoId);
    revalidateTag(videosTag, { expire: 0 });
    revalidatePath("/");
  });
  return new Response(null, { status: 204 });
}

async function untilInFeed(videoId: string, tries = 6) {
  for (let i = 0; i < tries; i++) {
    try {
      const feed = await (await fetch(feedUrl, { cache: "no-store" })).text();
      if (feed.includes(`<yt:videoId>${videoId}</yt:videoId>`)) return;
    } catch {
      // try again
    }
    await new Promise((r) => setTimeout(r, 8000));
  }
  // Still missing: refresh anyway; the hourly revalidation picks it up later.
}
