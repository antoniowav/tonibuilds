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

## Develop

```sh
npm install
npm run dev      # http://localhost:3000
npm run lint && npm run build
```

## Deploy

Vercel project with the domain `tonibuilds.codaproduct.studio`; in Cloudflare DNS a
`CNAME tonibuilds → cname.vercel-dns.com` (DNS only).
