"use client";

import { useLocale } from "@/i18n/LocaleProvider";

export default function LocaleSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
      className={`text-sm font-bold bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition ${className}`}
      title={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
    >
      {locale === "ar" ? "EN" : "عربي"}
    </button>
  );
}
