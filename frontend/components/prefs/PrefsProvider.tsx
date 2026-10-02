"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { isLocale, translate, type Locale } from "@/lib/i18n";

type Theme = "light" | "dark";

type Prefs = {
  locale: Locale;
  theme: Theme;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
  t: (key: Parameters<typeof translate>[1], vars?: Record<string, string | number>) => string;
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

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [theme, setThemeState] = useState<Theme>("light");

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
      t: (key, vars) => translate(locale, key, vars),
    }),
    [locale, theme],
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
    };
  }
  return value;
}
