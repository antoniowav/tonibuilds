"use client";

import { useSyncExternalStore } from "react";
import { themes, type Theme } from "./themes";

// The theme lives in <html data-theme>, set before paint by themeScript; this
// component just reads and changes that attribute.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function current(): Theme {
  const t = document.documentElement.dataset.theme as Theme | undefined;
  return t && themes.includes(t) ? t : themes[0];
}

/** `omarchy-theme-next`, for the website: cycles through a few Omarchy palettes. */
export default function ThemeSwitcher() {
  const theme = useSyncExternalStore(subscribe, current, () => themes[0]);

  function next() {
    const t = themes[(themes.indexOf(theme) + 1) % themes.length];
    document.documentElement.dataset.theme = t;
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
      className="rounded border border-line px-2 py-0.5 text-dim transition-colors hover:border-accent hover:text-accent"
      aria-label={`Colour theme: ${theme}. Switch to the next theme`}
      title="Switch theme"
    >
      <span aria-hidden>◐</span> {theme}
    </button>
  );
}
