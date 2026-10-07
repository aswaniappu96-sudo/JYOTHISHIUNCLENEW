"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { isLocale, translate, type I18nOverrides, type Locale } from "@/lib/i18n";

type Theme = "light" | "dark";

type Prefs = {
  locale: Locale;
  theme: Theme;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
  t: (key: Parameters<typeof translate>[1], vars?: Record<string, string | number>) => string;
  copy: (field: string, fallback?: string) => string;
};

const PrefsContext = createContext<Prefs | null>(null);

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
}

function applyLocale(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dataset.lang = locale;
}

export function PrefsProvider({
  children,
  initialStrings,
}: {
  children: ReactNode;
  initialStrings?: I18nOverrides;
}) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [theme, setThemeState] = useState<Theme>("light");
  const [wpStrings, setWpStrings] = useState<I18nOverrides>(initialStrings || {});

  useEffect(() => {
    try {
      const storedLang = localStorage.getItem("ju_lang");
      const storedTheme = localStorage.getItem("ju_theme");
      if (isLocale(storedLang)) {
        setLocaleState(storedLang);
        applyLocale(storedLang);
      }
      if (storedTheme === "dark" || storedTheme === "light") {
        setThemeState(storedTheme);
        applyTheme(storedTheme);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/wp/i18n", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { strings?: I18nOverrides } | null) => {
        if (!cancelled && data?.strings && typeof data.strings === "object") {
          setWpStrings(data.strings);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<Prefs>(
    () => ({
      locale,
      theme,
      setLocale: (next) => {
        setLocaleState(next);
        applyLocale(next);
        try {
          localStorage.setItem("ju_lang", next);
        } catch {
          /* ignore */
        }
      },
      setTheme: (next) => {
        setThemeState(next);
        applyTheme(next);
        try {
          localStorage.setItem("ju_theme", next);
        } catch {
          /* ignore */
        }
      },
      t: (key, vars) => translate(locale, key, vars, wpStrings),
      copy: (field, fallback = "") => {
        const fromLocale = wpStrings[locale]?.[field];
        const fromEn = wpStrings.en?.[field];
        return (fromLocale && fromLocale.trim()) || (fromEn && fromEn.trim()) || fallback;
      },
    }),
    [locale, theme, wpStrings],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  const value = useContext(PrefsContext);
  if (!value) {
    return {
      locale: "en" as Locale,
      theme: "light" as Theme,
      setLocale: () => undefined,
      setTheme: () => undefined,
      t: (key: Parameters<typeof translate>[1], vars?: Record<string, string | number>) => translate("en", key, vars),
      copy: (_field: string, fallback = "") => fallback,
    };
  }
  return value;
}
