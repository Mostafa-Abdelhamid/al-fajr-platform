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
    <header className="bg-night text-white">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between flex-wrap gap-4">
        <Link href="/" className="font-extrabold text-lg flex items-center gap-2">
          🌅 منصة الفجر
        </Link>

        <nav className="flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-semibold transition ${
                pathname === l.href ? "text-gold" : "text-gray-300 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {role === "STUDENT" && (
            <div className="flex items-center gap-3 text-sm">
              <span className="bg-white/10 rounded-full px-3 py-1.5 font-bold text-gold-light">
                ⭐ {points ?? 0} نقطة
              </span>
              <span className="bg-white/10 rounded-full px-3 py-1.5 font-bold text-orange-300">
                🔥 {streak ?? 0} متتالية
              </span>
            </div>
          )}
          <span className="hidden sm:inline text-sm text-gray-300">
            {avatarEmoji} {name}
          </span>
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
