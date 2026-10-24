"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

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

  const links =
    role === "STUDENT"
      ? [
          { href: "/student/dashboard", label: "لوحتي" },
          { href: "/student/book", label: "احجز حصة" },
        ]
      : role === "TEACHER"
      ? [
          { href: "/teacher/dashboard", label: "لوحتي" },
          { href: "/teacher/availability", label: "أوقات تواجدي" },
        ]
      : [{ href: "/admin/dashboard", label: "لوحة الإدارة" }];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="bg-fajr-night text-white sticky top-0 z-40 shadow-lg shadow-night/20">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between flex-wrap gap-4">
        <Link href="/" className="font-extrabold text-lg flex items-center gap-2">
          <span className="animate-float inline-block">🌅</span> منصة الفجر
        </Link>

        <nav className="flex items-center gap-6">
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

        <div className="flex items-center gap-4">
          {role === "STUDENT" && (
            <div className="flex items-center gap-2 text-sm">
              <span className="glass-panel rounded-full px-3 py-1.5 font-bold text-gold-light transition-transform hover:scale-105">
                ⭐ {points ?? 0} نقطة
              </span>
              <span className="glass-panel rounded-full px-3 py-1.5 font-bold text-orange-300 transition-transform hover:scale-105">
                🔥 {streak ?? 0} متتالية
              </span>
            </div>
          )}
          <Link
            href="/account/change-password"
            className="hidden sm:flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
            title="تغيير كلمة المرور"
          >
            <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">{avatarEmoji}</span>
            {name}
          </Link>
          <Link
            href="/account/change-password"
            className="sm:hidden text-sm font-bold bg-white/10 hover:bg-white/20 rounded-full px-3 py-2 transition"
            title="تغيير كلمة المرور"
          >
            ⚙️
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm font-bold bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition"
          >
            خروج
          </button>
        </div>
      </div>
    </header>
  );
}
