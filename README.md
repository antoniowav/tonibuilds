# tonibuilds.codaproduct.studio

Personal site of Toni Builds: Linux apps, products, YouTube videos and links.
Next.js (App Router) + Tailwind, styled like an Omarchy terminal, with six switchable Omarchy palettes.

## Editing

Everything the site says is in [`src/content.ts`](src/content.ts): intro, Linux projects, products, links.

Fetched live and refreshed at most once an hour (ISR), with the content file as fallback:

- **YouTube**: latest uploads from the channel's RSS feed (`src/lib/youtube.ts`).
- **GitHub**: description, stars and latest release of each public repo (`src/lib/github.ts`).
  Optional `GITHUB_TOKEN` env var raises GitHub's rate limit.

To show a private project's link once it's public, add `repo: "<name>"` to it in `content.ts`.

## New videos, automatically

When a video is published, YouTube's WebSub hub notifies `/api/youtube`; the
notification's signature is checked, and the home page refreshes once the video
is in the channel feed, usually within a couple of minutes. The hourly refresh
stays as a fallback.

- `src/app/api/youtube/route.ts`: hub verification (GET) and notifications (POST).
- `src/app/api/youtube/subscribe/route.ts`: (re)subscribes; called daily by Vercel Cron
  (`vercel.json`), as hub subscriptions expire after 10 days.

Vercel environment variables (Production):

| Variable | |
| --- | --- |
| `WEBSUB_SECRET` | random string; the hub signs notifications with it |
| `CRON_SECRET` | random string; Vercel sends it to the cron route as a bearer token |

To subscribe right away instead of waiting for the cron:

```sh
curl -H "Authorization: Bearer $CRON_SECRET" https://tonibuilds.codaproduct.studio/api/youtube/subscribe
```

## Develop

```sh
npm install
npm run dev      # http://localhost:3000
npm run lint && npm run build
```

## Deploy

Vercel project with the domain `tonibuilds.codaproduct.studio`; in Cloudflare DNS a
`CNAME tonibuilds → cname.vercel-dns.com` (DNS only).
