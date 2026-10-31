"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import type { Locale } from "@/i18n/config";

const OPTIONS: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ar", label: "عربي" },
];

const OPTION_WIDTH_REM = 3.5; // keep in sync with the `w-14` button/pill width below

export default function LocaleSwitcher({
  variant = "dark",
  className = "",
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  const { locale, setLocale } = useLocale();
  const activeIndex = OPTIONS.findIndex((o) => o.code === locale);

  const trackBg = variant === "dark" ? "bg-white/10" : "bg-night/10";
  const inactiveText = variant === "dark" ? "text-gray-300 hover:text-white" : "text-night/50 hover:text-night";

  return (
    <div
      dir="ltr"
      role="group"
      aria-label="Language"
      className={`relative inline-flex items-center rounded-full p-1 ${trackBg} ${className}`}
    >
      <span
        aria-hidden
        className="absolute top-1 bottom-1 w-14 rounded-full bg-white shadow-md transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(${activeIndex * OPTION_WIDTH_REM}rem)` }}
      />
      {OPTIONS.map((o) => (
        <button
          key={o.code}
          type="button"
          onClick={() => setLocale(o.code)}
          aria-pressed={locale === o.code}
          className={`relative z-10 w-14 py-1.5 text-xs font-bold rounded-full text-center transition-colors duration-300 ${
            locale === o.code ? "text-night" : inactiveText
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
