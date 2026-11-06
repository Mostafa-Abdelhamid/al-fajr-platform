"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { rateTeacher } from "@/i18n/dictionaries/rateTeacher";
import LoadingDots from "./LoadingDots";

function Stars({ value, size = "text-2xl" }: { value: number; size?: string }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={`${size} ${n <= value ? "text-gold" : "text-gray-300"}`}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function RateTeacherForm({
  sessionId,
  teacherName,
  initialStudentRating,
}: {
  sessionId: string;
  teacherName: string;
  initialStudentRating: number | null;
}) {
  const { locale } = useLocale();
  const t = makeT(rateTeacher, locale);

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submittedRating, setSubmittedRating] = useState<number | null>(initialStudentRating);

  if (submittedRating !== null) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="font-extrabold text-night text-sm mb-2">{t("thankYouTitle")}</p>
        <p className="text-xs text-muted mb-2">{t("youRated").replace("{teacherName}", teacherName)}</p>
        <Stars value={submittedRating} />
      </div>
    );
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/sessions/${sessionId}/rate-teacher`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, feedback }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("genericError"));
        setLoading(false);
        return;
      }
      setSubmittedRating(rating);
    } catch {
      setError(t("genericError"));
    }
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
      <p className="font-bold text-sm text-night">
        {t("howWasSessionWith").replace("{teacherName}", teacherName)}
      </p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            className={`text-2xl ${n <= rating ? "text-gold" : "text-gray-300"}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={2}
        className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm focus:border-dawn focus:outline-none"
        placeholder={t("feedbackPlaceholder")}
      />
      {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={rating === 0 || loading}
        className="w-full bg-gradient-to-l from-dawn to-gold text-white font-bold py-3 rounded-xl text-sm disabled:opacity-60"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            {t("submitting")}
            <LoadingDots />
          </span>
        ) : (
          t("submit")
        )}
      </button>
    </div>
  );
}
