"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PageLoading } from "@/components/layout/PageLoading";

function isInternalNav(anchor: HTMLAnchorElement) {
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return false;
  if (href.startsWith("#")) return false;
  try {
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    const samePath = url.pathname === window.location.pathname && url.search === window.location.search;
    if (samePath) return false;
    return true;
  } catch {
    return false;
  }
}

export function RouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const [pending, setPending] = useState(false);
  const hideTimer = useRef<number | null>(null);
  const shownAt = useRef(0);
  const routeKeyRef = useRef(routeKey);
  const pendingRef = useRef(false);
  pendingRef.current = pending;

  useEffect(() => {
    if (routeKeyRef.current === routeKey) return;
    routeKeyRef.current = routeKey;
    if (!pendingRef.current) return;
    const elapsed = Date.now() - shownAt.current;
    const wait = Math.max(450 - elapsed, 80);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setPending(false), wait);
  }, [routeKey]);

  useEffect(() => {
    const start = () => {
      shownAt.current = Date.now();
      setPending(true);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setPending(false), 12000);
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor || !isInternalNav(anchor)) return;
      start();
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  if (!pending) return null;

  return (
    <div className="fixed inset-0 z-[200] flex cursor-wait flex-col bg-[#fffbf4]/92 backdrop-blur-sm" aria-busy="true" aria-live="polite">
      <div className="h-1.5 w-full overflow-hidden bg-primary/20">
        <div className="h-full w-1/3 animate-[routebar_1s_ease-in-out_infinite] bg-primary" />
      </div>
      <PageLoading message="Opening page…" />
    </div>
  );
}
