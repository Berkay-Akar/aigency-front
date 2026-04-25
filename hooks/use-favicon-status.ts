"use client";

import { useEffect, useRef } from "react";
import { useStudioStore } from "@/store/studio-store";

const EMOJI_LOADING = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⏳</text></svg>`;
const EMOJI_DONE = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">✅</text></svg>`;

function getFaviconLink(): HTMLLinkElement {
  let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  return link;
}

export function useFaviconStatus() {
  const isGenerating = useStudioStore((s) => s.isGenerating);
  const result = useStudioStore((s) => s.result);
  const defaultHref = useRef<string | null>(null);

  // Capture the original favicon URL set by Next.js on first render
  useEffect(() => {
    defaultHref.current = getFaviconLink().href || "/favicon.ico";
  }, []);

  useEffect(() => {
    const link = getFaviconLink();
    if (isGenerating) {
      link.href = EMOJI_LOADING;
    } else if (result) {
      link.href = EMOJI_DONE;
      const id = setTimeout(() => {
        link.href = defaultHref.current ?? "/favicon.ico";
      }, 5000);
      return () => clearTimeout(id);
    } else {
      if (defaultHref.current) link.href = defaultHref.current;
    }
  }, [isGenerating, result]);
}
