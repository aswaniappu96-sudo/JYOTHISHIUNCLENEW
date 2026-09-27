export type WhatsAppReturnKind = "consultation" | "pooja" | "product" | "travel";

export type WhatsAppReturnPayload = {
  kind: WhatsAppReturnKind;
  at: number;
  freeSlot?: boolean;
};

const STORAGE_KEY = "ju-whatsapp-return";

export function markWhatsAppReturn(kind: WhatsAppReturnKind, extra?: { freeSlot?: boolean }) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ kind, at: Date.now(), freeSlot: extra?.freeSlot === true }),
    );
  } catch {
    /* ignore */
  }
}

export function readWhatsAppReturn(): WhatsAppReturnPayload | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { kind?: WhatsAppReturnKind; at?: number; freeSlot?: boolean };
    if (!parsed?.kind || !parsed.at) return null;
    return { kind: parsed.kind, at: parsed.at, freeSlot: parsed.freeSlot === true };
  } catch {
    return null;
  }
}

export function clearWhatsAppReturn() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function prepareWhatsAppTab() {
  if (typeof window === "undefined") return null;
  try {
    const tab = window.open("about:blank", "_blank");
    return tab && !tab.closed ? tab : null;
  } catch {
    return null;
  }
}

export function abandonWhatsAppTab(tab?: Window | null) {
  try {
    tab?.close();
  } catch {
    /* ignore */
  }
}

export function redirectToWhatsApp(
  href: string,
  kind: WhatsAppReturnKind,
  tab?: Window | null,
  extra?: { freeSlot?: boolean },
) {
  if (!href) {
    abandonWhatsAppTab(tab);
    return;
  }
  markWhatsAppReturn(kind, extra);
  try {
    window.dispatchEvent(new Event("ju-whatsapp-opened"));
  } catch {
    /* ignore */
  }
  try {
    if (tab && !tab.closed) {
      tab.location.replace(href);
      tab.focus();
      return;
    }
  } catch {
    /* fall through */
  }
  const opened = window.open(href, "_blank");
  if (!opened) window.location.assign(href);
}

export function shouldShowWhatsAppReturn(minAwayMs = 900) {
  const pending = readWhatsAppReturn();
  if (!pending) return false;
  return Date.now() - pending.at >= minAwayMs;
}
