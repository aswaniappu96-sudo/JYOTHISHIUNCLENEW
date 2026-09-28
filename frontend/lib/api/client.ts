const DEFAULT_WP_URL = "http://127.0.0.1:10101";
const GET_CACHE_MS = 60_000;
const getCache = new Map<string, { expires: number; data: unknown }>();
const getInflight = new Map<string, Promise<unknown>>();

function wordpressOrigin() {
  return (process.env.WORDPRESS_URL || DEFAULT_WP_URL).replace(/\/$/, "");
}

function isLocalWordpress() {
  try {
    const host = new URL(wordpressOrigin()).hostname;
    return host === "127.0.0.1" || host === "localhost" || host === "0.0.0.0" || host.endsWith(".local");
  } catch {
    return false;
  }
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

export async function wpFetch<T>(path: string, init?: RequestInit): Promise<T> {
  // Skip only on Vercel's cloud runtime, never during local `next dev`.
  if (process.env.VERCEL_ENV && isLocalWordpress()) {
    throw new WordpressApiError(
      `WordPress origin is local and cannot be reached from Vercel (${path}). Set WORDPRESS_URL to a public site.`,
      503,
    );
  }

  const url = `${wordpressOrigin()}/wp-json/ju/v1${path.startsWith("/") ? path : `/${path}`}`;
  const method = (init?.method || "GET").toUpperCase();
  const skipCache = method !== "GET" || init?.cache === "no-store";

  if (!skipCache) {
    const hit = getCache.get(url);
    if (hit && hit.expires > Date.now()) {
      return hit.data as T;
    }
    const pending = getInflight.get(url);
    if (pending) {
      return pending as Promise<T>;
    }
  }

  const request = (async () => {
    const headers = new Headers(init?.headers);
    const host = process.env.WORDPRESS_HOST;
    if (host && !headers.has("Host")) {
      headers.set("Host", host);
    }

    const controller = new AbortController();
    const timeoutMs = process.env.VERCEL ? 15000 : 20000;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...init,
        headers,
        cache: "no-store",
        signal: init?.signal || controller.signal,
      });

      if (!response.ok) {
        throw new WordpressApiError(
          `WordPress API ${path} failed (${response.status})`,
          response.status,
        );
      }

      const data = (await response.json()) as T;
      if (!skipCache) {
        getCache.set(url, { expires: Date.now() + GET_CACHE_MS, data });
      }
      return data;
    } catch (error) {
      if (error instanceof WordpressApiError) throw error;
      throw new WordpressApiError(
        `WordPress did not respond in time (${path}). Start the site in Local, then refresh.`,
        504,
      );
    } finally {
      clearTimeout(timeout);
    }
  })();

  if (!skipCache) {
    getInflight.set(url, request);
    try {
      return (await request) as T;
    } finally {
      getInflight.delete(url);
    }
  }

  return request;
}

export async function wpMutate<T>(path: string, body: unknown, token?: string | null): Promise<T> {
  const url = `${wordpressOrigin()}/wp-json/ju/v1${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers({ "Content-Type": "application/json" });
  const host = process.env.WORDPRESS_HOST;
  if (host) headers.set("Host", host);
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
  const url = `${wordpressOrigin()}/wp-json/ju/v1${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers();
  const host = process.env.WORDPRESS_HOST;
  if (host) headers.set("Host", host);
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
  const origin = wordpressOrigin();
  return url
    .replace("http://jyothishiuncle.local", origin)
    .replace("https://jyothishiuncle.local", origin)
    .replace("http://localhost:10101", origin);
}
