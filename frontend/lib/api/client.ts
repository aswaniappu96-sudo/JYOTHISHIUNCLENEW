const DEFAULT_WP_URL = "http://127.0.0.1:10101";
const PRODUCTION_WP_URL = "https://jyothishiuncle.ct.ws";
const FALLBACK_WP_URL = "https://jyothishuncle.velvetbyte.com";
const GET_CACHE_MS = 60_000;
const getCache = new Map<string, { expires: number; data: unknown }>();
const getInflight = new Map<string, Promise<unknown>>();

function wordpressOrigin() {
  const fromEnv = process.env.WORDPRESS_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL) return PRODUCTION_WP_URL;
  return DEFAULT_WP_URL;
}

function wordpressFallbackOrigin() {
  return (process.env.WORDPRESS_FALLBACK_URL || FALLBACK_WP_URL).replace(/\/$/, "");
}

function isLocalHost(origin: string) {
  try {
    const host = new URL(origin).hostname;
    return host === "127.0.0.1" || host === "localhost" || host === "0.0.0.0" || host.endsWith(".local");
  } catch {
    return false;
  }
}

function isLocalWordpress() {
  return isLocalHost(wordpressOrigin());
}

export function wordpressMediaOrigin() {
  return isLocalWordpress() ? wordpressFallbackOrigin() : wordpressOrigin();
}

export class WordpressApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "WordpressApiError";
  }
}

function juUrl(origin: string, path: string) {
  return `${origin}/wp-json/ju/v1${path.startsWith("/") ? path : `/${path}`}`;
}

let localDownUntil = 0;

function localWordpressSkipped() {
  return Date.now() < localDownUntil;
}

function markLocalWordpressDown() {
  localDownUntil = Date.now() + 30_000;
}

function fetchHeaders(init: RequestInit | undefined, sendLocalHost: boolean) {
  const headers = new Headers(init?.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (!headers.has("User-Agent")) {
    headers.set(
      "User-Agent",
      "Mozilla/5.0 (compatible; JyothishiUncleBot/1.0; +https://jyothishiuncle-new.vercel.app)",
    );
  }
  const host = process.env.WORDPRESS_HOST;
  if (sendLocalHost && host && !headers.has("Host")) {
    headers.set("Host", host);
  } else {
    headers.delete("Host");
  }
  return headers;
}

async function fetchJsonOrNull<T>(
  origin: string,
  path: string,
  init: RequestInit | undefined,
  sendLocalHost: boolean,
): Promise<T | null> {
  const url = juUrl(origin, path);
  const headers = fetchHeaders(init, sendLocalHost);
  const timeoutMs = isLocalHost(origin) ? 1500 : process.env.VERCEL ? 28000 : 12000;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...init,
      headers,
      cache: "no-store",
      signal: init?.signal || controller.signal,
    });
    const type = response.headers.get("content-type") || "";
    if (!response.ok || !type.includes("json")) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchJson<T>(origin: string, path: string, init: RequestInit | undefined, sendLocalHost: boolean): Promise<T> {
  const data = await fetchJsonOrNull<T>(origin, path, init, sendLocalHost);
  if (data != null) return data;
  throw new WordpressApiError(
    `WordPress is not reachable (${path}). Start the site in Local, then refresh.`,
    503,
  );
}

export async function wpFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (process.env.VERCEL_ENV && isLocalWordpress()) {
    throw new WordpressApiError(
      `WordPress origin is local and cannot be reached from Vercel (${path}). Set WORDPRESS_URL to a public site.`,
      503,
    );
  }

  const primary = wordpressOrigin();
  const fallback = wordpressFallbackOrigin();
  const method = (init?.method || "GET").toUpperCase();
  const skipCache = method !== "GET" || init?.cache === "no-store";
  const cacheKey = juUrl(primary, path);

  if (!skipCache) {
    const hit = getCache.get(cacheKey);
    if (hit && hit.expires > Date.now()) {
      return hit.data as T;
    }
    const pending = getInflight.get(cacheKey);
    if (pending) {
      return pending as Promise<T>;
    }
  }

  const request = (async () => {
    const useFallback = Boolean(fallback && fallback !== primary);
    if (isLocalHost(primary) && useFallback) {
      if (!localWordpressSkipped()) {
        const local = await fetchJsonOrNull<T>(primary, path, init, true);
        if (local != null) {
          if (!skipCache) getCache.set(cacheKey, { expires: Date.now() + GET_CACHE_MS, data: local });
          return local;
        }
        markLocalWordpressDown();
      }
      const data = await fetchJson<T>(fallback, path, init, false);
      if (!skipCache) getCache.set(cacheKey, { expires: Date.now() + GET_CACHE_MS, data });
      return data;
    }
    const data = await fetchJsonOrNull<T>(primary, path, init, isLocalHost(primary));
    if (data != null) {
      if (!skipCache) getCache.set(cacheKey, { expires: Date.now() + GET_CACHE_MS, data });
      return data;
    }
    if (!useFallback) {
      throw new WordpressApiError(
        `WordPress is not reachable (${path}). Start the site in Local, then refresh.`,
        503,
      );
    }
    const remote = await fetchJson<T>(fallback, path, init, false);
    if (!skipCache) getCache.set(cacheKey, { expires: Date.now() + GET_CACHE_MS, data: remote });
    return remote;
  })();

  if (!skipCache) {
    getInflight.set(cacheKey, request);
    try {
      return (await request) as T;
    } finally {
      getInflight.delete(cacheKey);
    }
  }

  return request;
}

export async function wpMutate<T>(path: string, body: unknown, token?: string | null): Promise<T> {
  const url = juUrl(wordpressOrigin(), path);
  const headers = new Headers({ "Content-Type": "application/json" });
  const host = process.env.WORDPRESS_HOST;
  if (host && isLocalWordpress()) headers.set("Host", host);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const json = (await response.json().catch(() => ({}))) as T & { message?: string; code?: string };
  if (!response.ok) {
    const message =
      (json as { message?: string }).message ||
      `WordPress API ${path} failed (${response.status})`;
    throw new WordpressApiError(message, response.status);
  }
  return json;
}

export async function wpAuthGet<T>(path: string, token: string): Promise<T> {
  const url = juUrl(wordpressOrigin(), path);
  const headers = new Headers();
  const host = process.env.WORDPRESS_HOST;
  if (host && isLocalWordpress()) headers.set("Host", host);
  headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(url, { method: "GET", headers, cache: "no-store" });
  const json = (await response.json().catch(() => ({}))) as T & { message?: string };
  if (!response.ok) {
    throw new WordpressApiError(json.message || `WordPress API ${path} failed (${response.status})`, response.status);
  }
  return json;
}

export async function wpFetchOptional<T>(path: string): Promise<T | null> {
  try {
    return await wpFetch<T>(path);
  } catch {
    return null;
  }
}

export function mediaUrl(url?: string | null) {
  if (!url) return null;
  const origin = wordpressMediaOrigin();
  return url
    .replace("http://jyothishiuncle.local", origin)
    .replace("https://jyothishiuncle.local", origin)
    .replace("http://localhost:10101", origin)
    .replace("http://127.0.0.1:10101", origin);
}
