import { youtube } from "@/content";

export type Video = {
  id: string;
  title: string;
  published: string; // ISO date
  views: number | null;
  url: string;
  thumbnail: string;
};

// Shown if the feed can't be reached, so the section is never empty.
const fallback: Video[] = [
  {
    id: "X7hr4YE9pig",
    title: "I am selling My Mac and Building My Own Apps on Linux (with AI)",
    published: "2026-10-02T00:00:00Z",
    views: null,
    url: "https://www.youtube.com/watch?v=X7hr4YE9pig",
    thumbnail: "https://i.ytimg.com/vi/X7hr4YE9pig/maxresdefault.jpg",
  },
];

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

export const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${youtube.channelId}`;

/** Cache tag of the feed, so a new-video notification can refresh it (src/app/api/youtube). */
export const videosTag = "youtube";

/**
 * The sharpest thumbnail YouTube has for a video: maxresdefault (1280×720) exists for
 * most HD uploads but not all; sddefault (640×480, letterboxed to 640×360) always does.
 * hqdefault, 480×360 with black bars, is too small for a large card.
 */
async function thumbnail(id: string): Promise<string> {
  const best = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  try {
    const res = await fetch(best, { method: "HEAD", next: { revalidate: 86400 } });
    if (res.ok) return best;
  } catch {
    // fall through
  }
  return `https://i.ytimg.com/vi/${id}/sddefault.jpg`;
}

const tag = (xml: string, name: string) => xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1];

/** The channel's latest uploads (newest first), from its public RSS feed. */
export async function latestVideos(): Promise<Video[]> {
  try {
    const res = await fetch(feedUrl, { next: { revalidate: 3600, tags: [videosTag] } });
    if (!res.ok) return fallback;
    const xml = await res.text();
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, 7); // the page shows 7
    const videos = entries.flatMap(([, entry]) => {
      const id = tag(entry, "yt:videoId");
      if (!id || !/^[\w-]{11}$/.test(id)) return [];
      const views = entry.match(/<media:statistics views="(\d+)"/)?.[1];
      return [{
        id,
        title: decode(tag(entry, "title") ?? ""),
        published: tag(entry, "published") ?? "",
        views: views ? Number(views) : null,
        url: `https://www.youtube.com/watch?v=${id}`,
        thumbnail: "",
      }];
    });
    await Promise.all(videos.map(async (v) => (v.thumbnail = await thumbnail(v.id))));
    return videos.length ? videos : fallback;
  } catch {
    return fallback;
  }
}
