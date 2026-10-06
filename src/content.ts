// Everything the site says lives here. Videos, stars and descriptions of public
// repos are fetched live (see src/lib); the values below are the fallback.

export const site = {
  name: "Toni Builds",
  url: "https://tonibuilds.codaproduct.studio",
  prompt: "toni@builds",
  person: "Toni",
  fullName: "Antonio Piattelli",
  location: "Gothenburg, Sweden",
  intro: "I build Linux apps, small products and features on my own SaaS, mostly on camera.",
  sub: "Chill coding, tech talk, product stuff. Everything runs on Arch + Hyprland (Omarchy).",
  description:
    "Toni Builds: Linux apps, small products and coding videos by Toni (Antonio Piattelli) from Coda Product Studio.",
};

export const youtube = {
  channelId: "UCOQj1ifXw2PHiaX-52G5zIA",
  url: "https://www.youtube.com/@tonibuilds",
};

export type LinuxProject = {
  name: string;
  repo?: string; // public GitHub repo under antoniowav; omitted while private
  blurb: string;
  language: string;
  install?: string;
  status?: string; // shown instead of a release for work in progress
  basedOn?: { name: string; url: string; modified?: boolean }; // credit for a project it builds on
};

export const linux: LinuxProject[] = [
  {
    name: "cutline",
    repo: "cutline",
    blurb: "Multi-track video editor for Linux: cut, trim, stack clips, frame-exact ffmpeg export",
    language: "Python",
    install: "git clone https://github.com/antoniowav/cutline && cd cutline && ./install",
  },
  {
    name: "jotter",
    repo: "jotter",
    blurb: "Tiny terminal notes app: plain markdown files, folders, live preview",
    language: "Go",
    install: "git clone https://github.com/antoniowav/jotter && cd jotter && ./install",
  },
  {
    name: "sprawl",
    repo: "sprawl",
    blurb: "Pixel-art city builder for Linux: zone, power and grow a hamlet into a metropolis, in your theme's colours",
    language: "Go",
    install: "git clone https://github.com/antoniowav/sprawl && cd sprawl && dist/install.sh",
  },
  {
    name: "omarchy-departures",
    repo: "omarchy-departures",
    blurb: "Live public transport departures in your Omarchy bar — every Swedish operator via Trafiklab ResRobot",
    language: "QML",
  },
  {
    name: "omarchy-elpris",
    repo: "omarchy-elpris",
    blurb: "Nord Pool electricity spot price in your Omarchy bar — hourly chart, cheapest hours at a glance",
    language: "QML",
  },
  {
    name: "omarchy-appsweep",
    repo: "omarchy-appsweep",
    blurb: "Bulk-remove packages and web apps on Omarchy from a floating checkbox panel",
    language: "QML",
  },
  {
    name: "cuore",
    blurb: "An Arch Linux desktop where every app is your choice: Hyprland + Quickshell, nothing preinstalled",
    language: "Distro",
    status: "early development",
  },
  {
    name: "ferry",
    blurb: "Terminal client for iPhone messages (SMS, RCS, iMessage) on Linux, over Bluetooth",
    language: "Go",
    status: "coming soon",
    basedOn: { name: "BlueFerry", url: "https://github.com/erikwb/blueferry", modified: true },
  },
  {
    name: "terminal-newtab",
    blurb: "A terminal-style new tab page for Chromium, in your Omarchy theme's colours and font",
    language: "JavaScript",
    status: "coming soon",
  },
];

export type Product = { name: string; blurb: string; url: string };

export const products: Product[] = [
  { name: "Kontra", blurb: "Deal-management SaaS: pipelines, contracts and clients in one workspace", url: "https://usekontra.com" },
  { name: "CV Tailor", blurb: "Tailors your CV, cover letter and screening answers to any job ad", url: "https://fit.codaproduct.studio" },
  { name: "OG Image Studio", blurb: "Design 1200×630 social cards in the browser, with a live og:image endpoint", url: "https://og-studio-nu.vercel.app" },
  { name: "Tavola", blurb: "A curated guide to authentic Italian dining across Scandinavia", url: "https://tavola-se.netlify.app" },
  { name: "Radion", blurb: "A web player for human-curated internet radio. No algorithms", url: "https://radionweb.netlify.app" },
];

export const studio = {
  name: "Coda Product Studio",
  blurb: "My product studio in Gothenburg: apps, platforms and digital products, from idea to launch.",
  url: "https://codaproduct.studio",
};

export type Link = { name: string; label: string; url: string };

export const links: Link[] = [
  { name: "youtube", label: "youtube.com/@tonibuilds", url: "https://www.youtube.com/@tonibuilds" },
  { name: "instagram", label: "instagram.com/okbye_toni", url: "https://www.instagram.com/okbye_toni" },
  { name: "github", label: "github.com/antoniowav", url: "https://github.com/antoniowav" },
  { name: "linkedin", label: "linkedin.com/in/antoniopiattelli", url: "https://www.linkedin.com/in/antoniopiattelli/" },
  { name: "studio", label: "codaproduct.studio", url: "https://codaproduct.studio" },
  { name: "email", label: "hello@antoniopiattelli.com", url: "mailto:hello@antoniopiattelli.com" },
];
