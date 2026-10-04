import Image from "next/image";
import CopyButton from "@/components/CopyButton";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { linux, links, products, site, studio, youtube } from "@/content";
import { repoInfo } from "@/lib/github";
import { latestVideos, type Video } from "@/lib/youtube";

// Rebuilt in the background at most once an hour, so new videos and stars show up by themselves.
export const revalidate = 3600;

const sections = [
  { id: "videos", label: "videos" },
  { id: "linux", label: "linux" },
  { id: "products", label: "products" },
  { id: "links", label: "links" },
];

const date = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

const views = (n: number | null) =>
  n === null ? "" : `${new Intl.NumberFormat("en", { notation: "compact" }).format(n)} views`;

const host = (url: string) => url.replace(/^(https?:\/\/|mailto:)(www\.)?/, "").replace(/\/$/, "");

export default async function Home() {
  const [videos, repos] = await Promise.all([
    latestVideos(),
    Promise.all(linux.map((p) => (p.repo ? repoInfo(p.repo) : Promise.resolve(null)))),
  ]);
  const [latest, ...older] = videos;

  return (
    <>
      <Bar />
      <main className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <Hero />

        <Section id="videos" path="~/videos" cmd="ls -t | head">
          <a
            href={latest.url}
            className="group grid gap-4 rounded-lg border border-line bg-bg-2 p-3 transition-colors hover:border-accent sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] sm:p-4"
          >
            <Thumb video={latest} priority />
            <div className="flex flex-col justify-center gap-2">
              <span className="text-xs uppercase tracking-widest text-red">▶ latest video</span>
              <h3 className="text-lg font-bold leading-snug text-fg group-hover:text-accent">{latest.title}</h3>
              <p className="text-sm text-dim">
                {[date(latest.published), views(latest.views)].filter(Boolean).join(" · ")}
              </p>
            </div>
          </a>
          {older.length > 0 && (
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {older.slice(0, 6).map((v) => (
                <li key={v.id}>
                  <a href={v.url} className="group block rounded-lg border border-line bg-bg-2 p-2 transition-colors hover:border-accent">
                    <Thumb video={v} />
                    <h3 className="mt-2 line-clamp-2 text-sm font-bold group-hover:text-accent">{v.title}</h3>
                    <p className="text-xs text-dim">{date(v.published)}</p>
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-sm">
            <a href={youtube.url} className="text-accent hover:underline">
              → all videos on youtube.com/@tonibuilds
            </a>
          </p>
        </Section>

        <Section id="linux" path="~/linux" cmd="ls --long">
          <p className="mb-4 text-sm text-dim">Apps and tools I build for my own Arch + Hyprland desktop, and share.</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {linux.map((p, i) => {
              const live = repos[i];
              const released = live?.release;
              return (
                <li key={p.name} className="flex flex-col gap-2 rounded-lg border border-line bg-bg-2 p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-bold text-accent">
                      {p.repo ? (
                        <a href={`https://github.com/antoniowav/${p.repo}`} className="hover:underline">
                          {p.name}
                        </a>
                      ) : (
                        p.name
                      )}
                    </h3>
                    {released ? (
                      <span className="text-xs text-green">{released}</span>
                    ) : p.status ? (
                      <span className="text-xs text-yellow">{p.status}</span>
                    ) : null}
                  </div>
                  <p className="text-sm text-dim">{live?.description ?? p.blurb}</p>
                  {p.install && (
                    <div className="flex items-center gap-2 rounded bg-bg px-2 py-1.5 text-xs">
                      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap">
                        <span className="text-green">$</span> {p.install}
                      </code>
                      <CopyButton text={p.install} />
                    </div>
                  )}
                  <p className="mt-auto flex gap-3 text-xs text-dim">
                    <span>{p.language}</span>
                    {live && <span>★ {live.stars}</span>}
                    {p.repo ? (
                      <a href={`https://github.com/antoniowav/${p.repo}`} className="ml-auto text-accent hover:underline">
                        source →
                      </a>
                    ) : (
                      <span className="ml-auto">private for now</span>
                    )}
                  </p>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section id="products" path="~/products" cmd="ls">
          <ul className="divide-y divide-line rounded-lg border border-line bg-bg-2">
            {products.map((p) => (
              <li key={p.name}>
                <a href={p.url} className="group flex flex-col gap-1 p-4 transition-colors hover:bg-bg-3 sm:flex-row sm:items-baseline sm:gap-4">
                  <span className="font-bold text-accent sm:w-40 sm:shrink-0">{p.name}</span>
                  <span className="flex-1 text-sm text-dim">{p.blurb}</span>
                  <span className="text-xs text-dim group-hover:text-accent">{host(p.url)} →</span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={studio.url}
            className="mt-4 flex flex-col gap-1 rounded-lg border border-accent/40 p-4 transition-colors hover:border-accent sm:flex-row sm:items-center sm:gap-4"
          >
            <span className="font-bold">{studio.name}</span>
            <span className="flex-1 text-sm text-dim">{studio.blurb}</span>
            <span className="text-sm text-accent">start a project →</span>
          </a>
        </Section>

        <Section id="links" path="~/links" cmd="ls -la">
          <ul className="rounded-lg border border-line bg-bg-2 p-4 text-sm">
            {links.map((l) => (
              <li key={l.name} className="flex flex-wrap gap-x-3">
                <span className="hidden text-dim sm:inline">lrwxrwxrwx</span>
                <span className="w-24 text-cyan">{l.name}</span>
                <span className="text-dim">-&gt;</span>
                <a href={l.url} className="break-all hover:text-accent hover:underline">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-4xl flex-col gap-1 px-4 py-6 text-xs text-dim sm:flex-row sm:justify-between sm:px-6">
          <span>
            © {new Date().getFullYear()} {site.fullName} · part of{" "}
            <a href={studio.url} className="text-accent hover:underline">
              {studio.name}
            </a>
          </span>
          <span>built on Omarchy · {site.location}</span>
        </div>
      </footer>
    </>
  );
}

/** A Waybar-style top bar: workspaces on the left, the theme switcher on the right. */
function Bar() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-bg-2/90 backdrop-blur">
      <nav className="mx-auto flex max-w-4xl items-center gap-1 px-4 py-2 text-sm sm:px-6" aria-label="Sections">
        <a href="#top" className="mr-2 font-bold text-accent">
          {site.prompt}
        </a>
        <ul className="flex gap-1">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="rounded px-1.5 py-0.5 text-dim hover:bg-bg-3 hover:text-fg">
                <span className="text-accent">{i + 1}</span>
                <span className="hidden sm:inline"> {s.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="ml-auto">
          <ThemeSwitcher />
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="pt-10 sm:pt-16">
      <div className="rounded-lg border-2 border-accent bg-bg-2 shadow-[0_0_40px_-12px_var(--accent)]">
        <div className="border-b border-line px-4 py-1.5 text-xs text-dim">~ — zsh</div>
        <div className="p-4 sm:p-6">
          <p className="text-sm">
            <Prompt /> whoami
          </p>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
            <Image
              src="/avatar.jpg"
              alt="Toni"
              width={112}
              height={112}
              priority
              className="h-24 w-24 rounded-lg border border-line object-cover sm:h-28 sm:w-28"
            />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{site.name}</h1>
              <p className="mt-2 max-w-xl">{site.intro}</p>
              <p className="mt-1 max-w-xl text-sm text-dim">{site.sub}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            <a href={youtube.url} className="rounded bg-red px-3 py-1.5 font-bold text-bg hover:opacity-90">
              ▶ watch on youtube
            </a>
            <a href="https://github.com/antoniowav" className="rounded border border-line px-3 py-1.5 hover:border-accent hover:text-accent">
              github
            </a>
            <a href={studio.url} className="rounded border border-line px-3 py-1.5 hover:border-accent hover:text-accent">
              coda studio
            </a>
          </div>
          <p className="mt-6 text-sm">
            <Prompt /> <span className="cursor" aria-hidden />
          </p>
        </div>
      </div>
    </section>
  );
}

function Prompt() {
  return (
    <span>
      <span className="text-green">{site.prompt}</span>
      <span className="text-dim">:</span>
      <span className="text-accent">~</span>
      <span className="text-dim">$</span>
    </span>
  );
}

function Section({ id, path, cmd, children }: { id: string; path: string; cmd: string; children: React.ReactNode }) {
  return (
    <section id={id} className="pt-14">
      <h2 className="mb-4 text-lg">
        <span className="font-bold text-accent">{path}</span> <span className="text-dim">$ {cmd}</span>
      </h2>
      {children}
    </section>
  );
}

function Thumb({ video, priority = false }: { video: Video; priority?: boolean }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded bg-bg-3">
      <Image
        src={video.thumbnail}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 640px) 450px, 100vw"
        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />
    </div>
  );
}
