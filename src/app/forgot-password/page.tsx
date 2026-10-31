"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { auth } from "@/i18n/dictionaries/auth";
import { nav } from "@/i18n/dictionaries/nav";

const STEPS = ["email", "reset", "done"] as const;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = makeT(auth, locale);
  const tNav = makeT(nav, locale);
  const [step, setStep] = useState<(typeof STEPS)[number]>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("genericError"));
        setLoading(false);
        return;
      }
      setInfo(data.message);
      setStep("reset");
    } catch {
      setError(t("connectionError"));
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("genericError"));
        setLoading(false);
        return;
      }
      setStep("done");
    } catch {
      setError(t("connectionError"));
    } finally {
      setLoading(false);
    }
  }

  const stepIndex = STEPS.indexOf(step);

  return (
    <AuthShell eyebrow={t("forgotEyebrow")} headline={t("forgotHeadline")}>
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl shadow-night/10 animate-scale-in">
        <div className="text-center mb-6">
          <Link href="/" className="lg:hidden text-2xl font-extrabold text-night">
            🌅 {tNav("brand")}
          </Link>
          <h2 className="text-xl font-extrabold text-night mt-1">
            {step === "email" && t("stepEmailTitle")}
            {step === "reset" && t("stepResetTitle")}
            {step === "done" && t("stepDoneTitle")}
          </h2>

          <div className="flex items-center justify-center gap-1.5 mt-4">
            {STEPS.map((s, i) => (
              <span
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  i <= stepIndex ? "bg-dawn w-8" : "bg-gray-200 w-4"
                }`}
              />
            ))}
          </div>
        </div>

        {step === "email" && (
          <form onSubmit={handleRequestOtp} className="space-y-4 animate-fade-up">
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
            {error && (
              <p className="text-sm text-red-600 font-semibold bg-red-50 rounded-xl px-4 py-3">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-l from-dawn to-gold text-white font-bold py-3.5 shadow-lg shadow-orange-300/40 hover:-translate-y-0.5 hover:shadow-xl transition-all disabled:opacity-60 disabled:translate-y-0"
            >
              {loading ? t("sendingCode") : t("sendCodeButton")}
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleReset} className="space-y-4 animate-fade-up">
            {info && (
              <p className="text-sm text-green font-semibold bg-green-50 rounded-xl p-3">{info}</p>
            )}
            <div>
              <label className="block text-sm font-bold text-night mb-1">{t("codeLabel")}</label>
              <input
                required
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-center tracking-[0.5em] font-bold focus:border-dawn focus:ring-4 focus:ring-dawn/10 focus:outline-none transition-shadow"
                placeholder="------"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-night mb-1">{t("newPasswordLabel")}</label>
              <input
                required
                type="password"
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:ring-4 focus:ring-dawn/10 focus:outline-none transition-shadow"
                placeholder={t("passwordPlaceholderMin")}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 font-semibold bg-red-50 rounded-xl px-4 py-3">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-l from-dawn to-gold text-white font-bold py-3.5 shadow-lg shadow-orange-300/40 hover:-translate-y-0.5 hover:shadow-xl transition-all disabled:opacity-60 disabled:translate-y-0"
            >
              {loading ? t("savingPassword") : t("setPasswordButton")}
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full text-xs font-bold text-muted hover:text-dawn transition"
            >
              {t("retryDifferentEmail")}
            </button>
          </form>
        )}

        {step === "done" && (
          <div className="text-center animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto mb-4 animate-scale-in">
              ✅
            </div>
            <p className="font-bold text-night mb-5">{t("doneMessage")}</p>
            <button
              onClick={() => router.push("/login")}
              className="w-full rounded-xl bg-gradient-to-l from-dawn to-gold text-white font-bold py-3.5 shadow-lg shadow-orange-300/40 hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              {t("goToLogin")}
            </button>
          </div>
        )}

        {step !== "done" && (
          <p className="text-center text-sm text-muted mt-6">
            {t("rememberedPassword")}{" "}
            <Link href="/login" className="text-dawn font-bold hover:underline">
              {t("loginLinkText")}
            </Link>
          </p>
        )}
      </div>
    </AuthShell>
  );
}
