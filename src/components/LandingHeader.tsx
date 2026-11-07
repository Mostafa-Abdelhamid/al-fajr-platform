"use client";

import { useState } from "react";
import Link from "next/link";
import LocaleSwitcher from "./LocaleSwitcher";

export default function LandingHeader({
  brand,
  navFeatures,
  navHow,
  navFaq,
  navLogin,
  navRegister,
}: {
  brand: string;
  navFeatures: string;
  navHow: string;
  navFaq: string;
  navLogin: string;
  navRegister: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const anchorLinks = [
    { href: "#features", label: navFeatures },
    { href: "#how", label: navHow },
    { href: "#faq", label: navFaq },
  ];

  return (
    <header className="sticky top-0 z-50 bg-cream/80 backdrop-blur-lg border-b border-black/5">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-3">
        <div className="font-extrabold text-xl text-night flex items-center gap-2 shrink-0">
          <span className="animate-float inline-block">🌅</span> {brand}
        </div>
        <nav className="hidden sm:flex items-center gap-7">
          {anchorLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-semibold hover:text-dawn transition">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/login" className="text-sm font-bold text-night">
            {navLogin}
          </Link>
          <Link
            href="/register"
            className="bg-gradient-to-l from-dawn to-gold text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg shadow-amber-300/40 hover:-translate-y-0.5 transition"
          >
            {navRegister}
          </Link>
          <LocaleSwitcher variant="light" />
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="sm:hidden w-10 h-10 rounded-xl bg-night/5 hover:bg-night/10 flex items-center justify-center transition shrink-0"
          aria-expanded={menuOpen}
        >
          <span className="text-lg leading-none">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-black/5 px-5 py-4 space-y-4 animate-fade-up">
          <nav className="flex flex-col gap-1">
            {anchorLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-night hover:bg-night/5 transition"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-black/5">
            <Link href="/login" className="text-sm font-bold text-night">
              {navLogin}
            </Link>
            <LocaleSwitcher variant="light" />
          </div>
          <Link
            href="/register"
            className="block text-center bg-gradient-to-l from-dawn to-gold text-white text-sm font-bold px-5 py-3 rounded-full shadow-lg shadow-amber-300/40"
          >
            {navRegister}
          </Link>
        </div>
      )}
    </header>
  );
}
