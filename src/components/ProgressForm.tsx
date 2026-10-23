"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SURAHS = [
  "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "يس", "الكهف",
  "الملك", "الرحمن", "الواقعة", "جزء عمّ", "أخرى",
];
const STATUSES = ["قيد الحفظ", "مراجعة", "مكتمل"];

export default function ProgressForm({ studentId }: { studentId: string }) {
  const router = useRouter();
  const [surah, setSurah] = useState(SURAHS[0]);
  const [status, setStatus] = useState(STATUSES[0]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    await fetch("/api/progress/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, surah, status }),
    });
    setLoading(false);
    setDone(true);
    router.refresh();
    setTimeout(() => setDone(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      <select
        value={surah}
        onChange={(e) => setSurah(e.target.value)}
        className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:border-dawn focus:outline-none"
      >
        {SURAHS.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:border-dawn focus:outline-none"
      >
        {STATUSES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-night text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-night-2 transition disabled:opacity-60"
      >
        {done ? "تم ✓" : loading ? "..." : "تحديث التقدم"}
      </button>
    </div>
  );
}
