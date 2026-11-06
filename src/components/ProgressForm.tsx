"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { teacher, progressStatusLabels } from "@/i18n/dictionaries/teacher";
import LoadingDots from "./LoadingDots";

// Surah names and progress-status values are stored as-is in the database
// and compared elsewhere (e.g. student dashboard checks p.status === "مكتمل"),
// so the underlying values stay Arabic in both locales — only the status
// option's displayed label is translated (see progressStatusLabels).
const SURAHS = [
  "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "يس", "الكهف",
  "الملك", "الرحمن", "الواقعة", "جزء عمّ", "أخرى",
];
const STATUSES = ["قيد الحفظ", "مراجعة", "مكتمل"];

export default function ProgressForm({ studentId }: { studentId: string }) {
  const router = useRouter();
  const { locale } = useLocale();
  const t = makeT(teacher, locale);
  const [surah, setSurah] = useState(SURAHS[0]);
  const [status, setStatus] = useState(STATUSES[0]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/progress/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, surah, status }),
      });
      setLoading(false);
      if (!res.ok) {
        setError(true);
        setTimeout(() => setError(false), 2500);
        return;
      }
      setDone(true);
      router.refresh();
      setTimeout(() => setDone(false), 2000);
    } catch {
      setLoading(false);
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      <select
        value={surah}
        onChange={(e) => setSurah(e.target.value)}
        className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:border-dawn focus:outline-none"
      >
        {SURAHS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:border-dawn focus:outline-none"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{progressStatusLabels[locale][s]}</option>
        ))}
      </select>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-night text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-night-2 transition disabled:opacity-60"
      >
        {error ? (
          t("saveFailed")
        ) : done ? (
          t("saved")
        ) : loading ? (
          <LoadingDots />
        ) : (
          t("updateProgress")
        )}
      </button>
    </div>
  );
}
