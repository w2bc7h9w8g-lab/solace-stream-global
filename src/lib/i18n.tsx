import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Locale registry: add a new locale here, then provide its strings in each `T` object.
export const LOCALES = [
  { code: "pt", label: "Português" },
  { code: "en", label: "English" },
] as const;
export type Locale = (typeof LOCALES)[number]["code"];
export type T = Record<Locale, string>;

const Ctx = createContext<{ locale: Locale; setLocale: (l: Locale) => void }>({
  locale: "pt",
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");
  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && LOCALES.some((l) => l.code === saved)) setLocaleState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : locale;
  }, [locale]);
  const setLocale = (l: Locale) => {
    localStorage.setItem("locale", l);
    setLocaleState(l);
  };
  return <Ctx.Provider value={{ locale, setLocale }}>{children}</Ctx.Provider>;
}

export function useLocale() {
  return useContext(Ctx);
}

/** Returns a translator: t({ pt: "...", en: "..." }) */
export function useT() {
  const { locale } = useContext(Ctx);
  return (s: T) => s[locale] ?? s.en;
}
