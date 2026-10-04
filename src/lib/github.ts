export type RepoInfo = { description: string | null; stars: number; release: string | null };

const headers: HeadersInit = {
  Accept: "application/vnd.github+json",
  // Optional: without a token GitHub allows 60 requests an hour per IP, which a shared host can run out of.
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`https://api.github.com/${path}`, { headers, next: { revalidate: 3600 } });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

/** Live description, stars and latest release of a public repo; null if GitHub can't be reached. */
export async function repoInfo(name: string): Promise<RepoInfo | null> {
  const [repo, release] = await Promise.all([
    get<{ description: string | null; stargazers_count: number }>(`repos/antoniowav/${name}`),
    get<{ tag_name: string }>(`repos/antoniowav/${name}/releases/latest`),
  ]);
  if (!repo) return null;
  return { description: repo.description, stars: repo.stargazers_count, release: release?.tag_name ?? null };
}
