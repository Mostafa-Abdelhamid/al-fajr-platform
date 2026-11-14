"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { auth } from "@/i18n/dictionaries/auth";
import { nav } from "@/i18n/dictionaries/nav";
import LocaleSwitcher from "./LocaleSwitcher";

export default function AuthShell({
  children,
  eyebrow,
  headline,
}: {
  children: React.ReactNode;
  eyebrow: string;
  headline: string;
}) {
  const { locale } = useLocale();
  const t = makeT(auth, locale);
  const tNav = makeT(nav, locale);

  const HIGHLIGHTS = [t("highlight1"), t("highlight2"), t("highlight3")];

  return (
    <main className="relative flex-1 grid lg:grid-cols-2 min-h-[calc(100vh-0px)]">
      <div className="absolute top-4 end-4 z-20">
        <LocaleSwitcher variant="light" />
      </div>
      {/* Decorative panel */}
      <div className="relative hidden lg:flex flex-col justify-between bg-fajr-night text-white p-12 overflow-hidden">
        <Link href="/" className="relative z-10 text-2xl font-extrabold w-fit">
          {tNav("brand")}
        </Link>

        <div className="relative z-10 animate-fade-up">
          <span className="inline-block text-gold-light text-xs font-bold bg-white/10 border border-white/20 px-4 py-1.5 rounded-full mb-5">
            {eyebrow}
          </span>
          <h1 className="text-3xl xl:text-4xl font-extrabold leading-snug max-w-md">
            {headline}
          </h1>
          <div className="mt-8 space-y-3">
            {HIGHLIGHTS.map((h, i) => (
              <div
                key={h}
                className={`animate-fade-up stagger-${i + 1} bg-white/10 border border-white/10 rounded-2xl px-4 py-3 w-fit`}
              >
                <span className="text-sm text-gray-200">{h}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-gray-400">
          {t("tagline")}
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-cream px-4 py-14">
        {children}
      </div>
    </main>
  );
}
