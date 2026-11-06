"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { certificates } from "@/i18n/dictionaries/certificates";

export default function IssueCertificateButton({
  studentId,
  studentName,
}: {
  studentId: string;
  studentName: string;
}) {
  const router = useRouter();
  const { locale } = useLocale();
  const t = makeT(certificates, locale);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/certificates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, title, note }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || t("issueFailed"));
      return;
    }
    setSuccess(true);
    setTitle("");
    setNote("");
    router.refresh();
    setTimeout(() => {
      setSuccess(false);
      setOpen(false);
    }, 1500);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-full px-3 py-2 transition"
      >
        {t("issueCertButton")}
      </button>
    );
  }

  return (
    <div className="w-full sm:w-80 bg-white border-2 border-amber-200 rounded-2xl p-4 shadow-lg animate-scale-in">
      <p className="text-xs font-bold text-night mb-3">
        {t("issueCertFormTitle")} — {studentName}
      </p>
      {success ? (
        <p className="text-sm font-bold text-green-700">{t("issueSuccess")}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("titlePlaceholder")}
            className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-xs focus:border-dawn focus:outline-none"
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("notePlaceholder")}
            rows={2}
            className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-xs focus:border-dawn focus:outline-none"
          />
          {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-l from-dawn to-gold text-white font-bold text-xs py-2 rounded-lg disabled:opacity-60"
            >
              {loading ? t("submittingLabel") : t("submitButton")}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs font-bold text-muted px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              {t("cancelButton")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
