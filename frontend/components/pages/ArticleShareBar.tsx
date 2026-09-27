"use client";

import { useState } from "react";

export function ArticleShareBar({ title, tags }: { title: string; tags: string[] }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(`${title} ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-surface-low p-4">
      {tags.length ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[11px] font-bold tracking-widest text-on-surface-variant uppercase">Tags:</span>
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-surface-high px-3 py-1 text-xs text-on-surface">
              #{tag.replace(/^#/, "")}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-[11px] font-bold tracking-widest text-on-surface-variant uppercase">Share this article</span>
      )}
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-bold tracking-widest text-on-surface-variant uppercase">Circulate:</span>
        <button
          type="button"
          onClick={copyLink}
          title={copied ? "Copied" : "Copy article link"}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-highest text-on-surface transition hover:bg-primary hover:text-surface-lowest"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10 5.93" />
            <path d="M14 11a5 5 0 0 0-7.07 0L5.52 12.41a5 5 0 0 0 7.07 7.07L14 18.07" />
          </svg>
        </button>
        <button
          type="button"
          onClick={shareWhatsApp}
          title="Share via WhatsApp"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-highest text-on-surface transition hover:bg-primary hover:text-surface-lowest"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3zm4.7 12.6c-.2.6-1.2 1.1-1.7 1.1-.4 0-.9.2-3-.8-2.5-1.2-4.1-3.6-4.2-3.8-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.5l-.3.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.3 2.5 1.4.3.1.5.1.7-.1l1-.1.4-.2c.2-.1.4-.1.6.1.2.2 1.1 1.1 1.2 1.3.2.2.2.4.1 1z" />
          </svg>
        </button>
        {copied ? <span className="text-xs text-primary">Copied</span> : null}
      </div>
    </div>
  );
}
