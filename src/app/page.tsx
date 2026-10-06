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
const pluginPage = (id: string) => `https://plugins.omarchy.org/plugin.html?id=${encodeURIComponent(id)}`;

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
            <Thumb video={latest} priority sizes="(min-width: 896px) 440px, (min-width: 640px) 50vw, calc(100vw - 58px)" />
            <div className="flex flex-col justify-center gap-2">
              <span className="text-xs uppercase tracking-widest text-red">▶ latest video</span>
              <h3 className="text-lg font-bold leading-snug text-fg group-hover:text-accent">{latest.title}</h3>
              <p className="text-sm text-dim">
                {[date(latest.published), views(latest.views)].filter(Boolean).join(" · ")}
              </p>
            </div>
          </a>
          {older.length > 0 && (
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {older.slice(0, 6).map((v) => (
                <li key={v.id}>
                  <a href={v.url} className="group block rounded-lg border border-line bg-bg-2 p-2 transition-colors hover:border-accent">
                    <Thumb video={v} sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, calc(100vw - 50px)" />
                    <h3 className="mt-2 line-clamp-2 text-sm font-bold group-hover:text-accent">{v.title}</h3>
                    <p className="text-xs text-dim">{date(v.published)}</p>
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-sm">
            <a href={youtube.url} className="-my-1.5 inline-block py-1.5 text-accent hover:underline">
              → all videos on youtube.com/@tonibuilds
            </a>
          </p>
        </Section>

        <Section id="linux" path="~/linux" cmd="ls --long">
          <p className="mb-4 text-sm text-dim">Apps and tools I build for my own Arch + Hyprland desktop, and share.</p>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {linux.map((p, i) => {
              const live = repos[i];
              const released = live?.release;
              return (
                <li key={p.name} className="flex min-w-0 flex-col gap-2 rounded-lg border border-line bg-bg-2 p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-bold text-accent">
                      {p.plugin ? (
                        <a href={pluginPage(p.plugin)} className="-my-1 inline-block py-1 hover:underline">
                          {p.name}
                        </a>
                      ) : p.repo ? (
                        <a href={`https://github.com/antoniowav/${p.repo}`} className="-my-1 inline-block py-1 hover:underline">
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
                  {p.basedOn && (
                    <p className="text-xs text-dim">
                      built on {p.basedOn.modified ? "a modified " : ""}
                      <a href={p.basedOn.url} className="-my-1.5 inline-block py-1.5 text-cyan hover:underline">
                        {p.basedOn.name}
                      </a>
                    </p>
                  )}
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
                    {p.plugin && (
                      <a href={pluginPage(p.plugin)} className="-my-1.5 ml-auto inline-block py-1.5 text-accent hover:underline">
                        plugin page →
                      </a>
                    )}
                    {p.repo ? (
                      <a href={`https://github.com/antoniowav/${p.repo}`} className={`-my-1.5 inline-block py-1.5 text-accent hover:underline ${p.plugin ? "" : "ml-auto"}`}>
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
          <ul className="rounded-lg border border-line bg-bg-2 px-4 py-2 text-sm">
            {links.map((l) => (
              <li key={l.name}>
                <a href={l.url} className="group flex min-w-0 items-baseline gap-x-3 py-1.5 sm:py-0.5">
                  <span className="hidden text-dim sm:inline">lrwxrwxrwx</span>
                  <span className="w-20 shrink-0 text-cyan sm:w-24">{l.name}</span>
                  <span className="shrink-0 text-dim">-&gt;</span>
                  <span className="min-w-0 truncate group-hover:text-accent group-hover:underline">{l.label}</span>
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
      <nav className="mx-auto flex max-w-4xl items-center gap-1 px-3 py-1.5 text-sm sm:px-6 sm:py-2" aria-label="Sections">
        <a href="#top" className="mr-2 hidden font-bold text-accent sm:inline">
          {site.prompt}
        </a>
        <ul className="flex min-w-0 gap-0.5 sm:gap-1">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="block rounded px-1.5 py-1 text-dim hover:bg-bg-3 hover:text-fg">
                <span className="hidden text-accent sm:inline">{i + 1} </span>
                {s.label}
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
    <section id="top" className="pt-6 sm:pt-16">
      <div className="rounded-lg border-2 border-accent bg-bg-2 shadow-[0_0_40px_-12px_var(--accent)]">
        <div className="border-b border-line px-4 py-1.5 text-xs text-dim">~ — zsh</div>
        <div className="p-4 sm:p-6">
          <p className="text-sm">
            <Prompt /> whoami
          </p>
          <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-3 sm:gap-x-5">
            <Image
              src="/avatar.jpg"
              alt="Toni"
              width={112}
              height={112}
              priority
              className="h-16 w-16 rounded-lg border border-line object-cover sm:row-span-2 sm:h-28 sm:w-28"
            />
            <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight sm:self-end sm:text-4xl">{site.name}</h1>
            <div className="col-span-2 sm:col-span-1 sm:col-start-2 sm:self-start">
              <p className="max-w-xl">{site.intro}</p>
              <p className="mt-1 max-w-xl text-sm text-dim">{site.sub}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2 text-center text-sm sm:flex sm:flex-wrap">
            <a href={youtube.url} className="col-span-2 rounded bg-red px-3 py-2 font-bold text-bg hover:opacity-90 sm:py-1.5">
              ▶ watch on youtube
            </a>
            <a href="https://github.com/antoniowav" className="rounded border border-line px-3 py-2 hover:border-accent hover:text-accent sm:py-1.5">
              github
            </a>
            <a href={studio.url} className="rounded border border-line px-3 py-2 hover:border-accent hover:text-accent sm:py-1.5">
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

function Thumb({ video, sizes, priority = false }: { video: Video; sizes: string; priority?: boolean }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded bg-bg-3">
      <Image
        src={video.thumbnail}
        alt=""
        fill
        priority={priority}
        quality={90}
        sizes={sizes}
        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />
    </div>
  );
}
