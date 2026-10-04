"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked: the command is still there to select by hand
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 rounded border border-line px-2 text-xs text-dim transition-colors hover:border-accent hover:text-accent"
      aria-label="Copy install command"
    >
      {copied ? "copied ✓" : "copy"}
    </button>
  );
}
