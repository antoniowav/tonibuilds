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
    thumbnail: "https://i.ytimg.com/vi/X7hr4YE9pig/hqdefault.jpg",
  },
];

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const tag = (xml: string, name: string) => xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1];

/** The channel's latest uploads (newest first), from its public RSS feed. */
export async function latestVideos(): Promise<Video[]> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${youtube.channelId}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return fallback;
    const xml = await res.text();
    const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].flatMap(([, entry]) => {
      const id = tag(entry, "yt:videoId");
      if (!id || !/^[\w-]{11}$/.test(id)) return [];
      const views = entry.match(/<media:statistics views="(\d+)"/)?.[1];
      return [{
        id,
        title: decode(tag(entry, "title") ?? ""),
        published: tag(entry, "published") ?? "",
        views: views ? Number(views) : null,
        url: `https://www.youtube.com/watch?v=${id}`,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      }];
    });
    return videos.length ? videos : fallback;
  } catch {
    return fallback;
  }
}
