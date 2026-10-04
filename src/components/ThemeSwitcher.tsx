"use client";

import { themes, type Theme } from "./themes";

// The theme lives in <html data-theme>, set before first paint by themeScript.
// The button's label comes from CSS (.theme-name in globals.css) so it is right
// from the first frame too; this component only changes the attribute.

/** `omarchy-theme-next`, for the website: cycles through a few Omarchy palettes. */
export default function ThemeSwitcher() {
  function next() {
    const html = document.documentElement;
    const now = html.dataset.theme as Theme | undefined;
    const t = themes[(themes.indexOf(now && themes.includes(now) ? now : themes[0]) + 1) % themes.length];
    html.classList.add("theme-switching"); // fade only on a switch, never on page load
    html.dataset.theme = t;
    setTimeout(() => html.classList.remove("theme-switching"), 300);
    try {
      localStorage.setItem("theme", t);
    } catch {
      // private mode or blocked storage: the theme just isn't remembered
    }
  }

  return (
    <button
      type="button"
      onClick={next}
      className="flex min-h-8 min-w-8 items-center justify-center gap-1 rounded border border-line px-2 py-0.5 text-dim transition-colors hover:border-accent hover:text-accent"
      aria-label="Switch colour theme"
      title="Switch theme"
    >
      <span aria-hidden>◐</span>
      <span className="theme-name hidden sm:inline" />
    </button>
  );
}
