"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { account } from "@/i18n/dictionaries/account";

export default function ChangePasswordPage() {
  const { locale } = useLocale();
  const t = makeT(account, locale);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError(t("mismatchError"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("genericError"));
        setLoading(false);
        return;
      }
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError(t("connectionError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md animate-fade-up">
      <h1 className="text-2xl font-extrabold text-night mb-1">{t("title")}</h1>
      <p className="text-muted mb-6 text-sm">{t("subtitle")}</p>

      <form onSubmit={handleSubmit} className="hover-lift bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-bold text-night mb-1">{t("currentPassword")}</label>
          <input
            required
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:ring-4 focus:ring-dawn/10 focus:outline-none transition-shadow"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-night mb-1">{t("newPassword")}</label>
          <input
            required
            type="password"
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:ring-4 focus:ring-dawn/10 focus:outline-none transition-shadow"
            placeholder={t("newPasswordPlaceholder")}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-night mb-1">{t("confirmNewPassword")}</label>
          <input
            required
            type="password"
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:ring-4 focus:ring-dawn/10 focus:outline-none transition-shadow"
            placeholder={t("confirmPasswordPlaceholder")}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 font-semibold bg-red-50 rounded-xl px-4 py-3 animate-fade-in">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-green font-semibold bg-green-50 rounded-xl px-4 py-3 animate-fade-in">
            {t("successMessage")}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-l from-dawn to-gold text-white font-bold py-3.5 shadow-lg shadow-orange-300/40 hover:-translate-y-0.5 hover:shadow-xl transition-all disabled:opacity-60 disabled:translate-y-0"
        >
          {loading ? t("saving") : t("submit")}
        </button>
      </form>
    </div>
  );
}
