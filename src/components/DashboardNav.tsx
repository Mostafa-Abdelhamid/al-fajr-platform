"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { nav } from "@/i18n/dictionaries/nav";
import LocaleSwitcher from "./LocaleSwitcher";
import AnimatedNumber from "./AnimatedNumber";

export default function DashboardNav({
  name,
  avatarEmoji,
  role,
  points,
  streak,
}: {
  name: string;
  avatarEmoji: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  points?: number;
  streak?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useLocale();
  const t = makeT(nav, locale);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const links =
    role === "STUDENT"
      ? [
          { href: "/student/dashboard", label: t("studentDashboard") },
          { href: "/student/book", label: t("studentBook") },
        ]
      : role === "TEACHER"
      ? [
          { href: "/teacher/dashboard", label: t("teacherDashboard") },
          { href: "/teacher/availability", label: t("teacherAvailability") },
        ]
      : [
          { href: "/admin/dashboard", label: t("adminOverview") },
          { href: "/admin/teachers", label: t("adminTeachers") },
          { href: "/admin/students", label: t("adminStudents") },
          { href: "/admin/qiraat", label: t("adminQiraat") },
          { href: "/admin/leaderboard", label: t("adminLeaderboard") },
          { href: "/admin/certificates", label: t("adminCertificates") },
        ];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const pointsStreak =
    role === "STUDENT" ? (
      <div className="flex items-center gap-2 text-sm">
        <span className="glass-panel rounded-full px-3 py-1.5 font-bold text-gold-light transition-transform hover:scale-105">
          ⭐ <AnimatedNumber value={points ?? 0} duration={800} /> {t("points")}
        </span>
        <span className="glass-panel rounded-full px-3 py-1.5 font-bold text-amber-300 transition-transform hover:scale-105">
          🔥 <AnimatedNumber value={streak ?? 0} duration={800} /> {t("streak")}
        </span>
      </div>
    ) : null;

  return (
    <header className="bg-fajr-night text-white sticky top-0 z-40 shadow-lg shadow-night/20">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="font-extrabold text-lg flex items-center gap-2 shrink-0">
          <span className="animate-float inline-block">🌅</span> {t("brand")}
        </Link>

        <nav className="hidden sm:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative text-sm font-semibold transition py-1 ${
                pathname === l.href ? "text-gold" : "text-gray-300 hover:text-white"
              }`}
            >
              {l.label}
              {pathname === l.href && (
                <span className="absolute -bottom-1 right-0 left-0 h-0.5 rounded-full bg-gold animate-scale-in" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-4">
          {pointsStreak}
          <Link
            href="/account/change-password"
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
            title={t("changePassword")}
          >
            <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">{avatarEmoji}</span>
            {name}
          </Link>
          <LocaleSwitcher />
          <button
            onClick={handleLogout}
            className="text-sm font-bold bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition"
          >
            {t("logout")}
          </button>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="sm:hidden w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition shrink-0"
          aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
          aria-expanded={menuOpen}
        >
          <span className="text-lg leading-none">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-white/10 px-5 py-4 space-y-4 animate-fade-up">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  pathname === l.href ? "bg-white/10 text-gold" : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {pointsStreak && <div className="px-1">{pointsStreak}</div>}

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
            <Link
              href="/account/change-password"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
            >
              <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                {avatarEmoji}
              </span>
              <span className="truncate">{name}</span>
            </Link>
            <LocaleSwitcher className="shrink-0" />
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-sm font-bold bg-white/10 hover:bg-white/20 rounded-full px-4 py-2.5 transition"
          >
            {t("logout")}
          </button>
        </div>
      )}
    </header>
  );
}
