import { useMemo } from "react";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import type { Locale } from "@/lib/i18n";

export type ItemI18n = Partial<Record<string, Partial<Record<string, string>>>>;

type WithI18n = { i18n?: ItemI18n };

export function withLocale<T extends WithI18n>(item: T, locale: Locale): T {
  if (locale === "en") return item;
  const pack = item.i18n?.[locale];
  if (!pack) return item;
  const next = { ...item };
  for (const [key, value] of Object.entries(pack)) {
    if (value && String(value).trim()) {
      (next as Record<string, unknown>)[key] = value;
    }
  }
  return next;
}

export function withLocaleList<T extends WithI18n>(items: T[], locale: Locale): T[] {
  return items.map((item) => withLocale(item, locale));
}

export function useLocalized<T extends WithI18n>(item: T): T {
  const { locale } = usePrefs();
  return useMemo(() => withLocale(item, locale), [item, locale]);
}

export function useLocalizedList<T extends WithI18n>(items: T[]): T[] {
  const { locale } = usePrefs();
  return useMemo(() => withLocaleList(items, locale), [items, locale]);
}
