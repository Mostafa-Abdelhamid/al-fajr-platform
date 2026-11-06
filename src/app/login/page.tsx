"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import LoadingDots from "@/components/LoadingDots";
import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { auth } from "@/i18n/dictionaries/auth";
import { nav } from "@/i18n/dictionaries/nav";

export default function LoginPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = makeT(auth, locale);
  const tNav = makeT(nav, locale);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("genericError"));
        setLoading(false);
        return;
      }
      const dest =
        data.role === "TEACHER"
          ? "/teacher/dashboard"
          : data.role === "ADMIN"
          ? "/admin/dashboard"
          : "/student/dashboard";
      router.push(dest);
      router.refresh();
    } catch {
      setError(t("connectionError"));
      setLoading(false);
    }
  }

  return (
    <AuthShell eyebrow={t("loginEyebrow")} headline={t("loginHeadline")}>
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl shadow-night/10 animate-scale-in">
        <div className="text-center mb-6">
          <Link href="/" className="lg:hidden text-2xl font-extrabold text-night">
            🌅 {tNav("brand")}
          </Link>
          <h2 className="text-xl font-extrabold text-night mt-1">{t("loginTitle")}</h2>
          <p className="text-muted mt-1 text-sm">{t("loginSubtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-night mb-1">{t("emailLabel")}</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:ring-4 focus:ring-dawn/10 focus:outline-none transition-shadow"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-bold text-night">{t("passwordLabel")}</label>
              <Link href="/forgot-password" className="text-xs font-bold text-dawn hover:underline">
                {t("forgotPasswordLink")}
              </Link>
            </div>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:ring-4 focus:ring-dawn/10 focus:outline-none transition-shadow"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 font-semibold bg-red-50 rounded-xl px-4 py-3 animate-fade-in">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-l from-dawn to-gold text-white font-bold py-3.5 shadow-lg shadow-amber-300/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-300/50 transition-all disabled:opacity-60 disabled:translate-y-0"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                {t("loginLoading")}
                <LoadingDots />
              </span>
            ) : (
              t("loginButton")
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          {t("noAccount")}{" "}
          <Link href="/register" className="text-dawn font-bold hover:underline">
            {t("registerNow")}
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
