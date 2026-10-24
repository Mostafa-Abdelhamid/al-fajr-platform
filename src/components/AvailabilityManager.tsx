"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DAYS = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const DAYS_SHORT = ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

type Slot = { id: string; dayOfWeek: number; startTime: string; endTime: string };

export default function AvailabilityManager({ initialSlots }: { initialSlots: Slot[] }) {
  const router = useRouter();
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [startTime, setStartTime] = useState("16:00");
  const [endTime, setEndTime] = useState("20:00");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dayOfWeek, startTime, endTime }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "تعذر الإضافة");
      return;
    }
    router.refresh();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/availability/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-extrabold text-night mb-4">إضافة وقت تواجد جديد</h3>

        <label className="block text-xs font-bold text-muted mb-2">اليوم</label>
        <div className="flex flex-wrap gap-2 mb-5" dir="rtl">
          {DAYS_SHORT.map((d, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setDayOfWeek(i)}
              className={`w-12 h-12 rounded-full text-xs font-bold flex flex-col items-center justify-center transition ${
                dayOfWeek === i
                  ? "bg-dawn text-white shadow-md scale-105"
                  : "bg-gray-50 text-night hover:bg-orange-50"
              }`}
            >
              {d.slice(0, 2)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-bold text-muted mb-1">من الساعة</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm focus:border-dawn focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted mb-1">إلى الساعة</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm focus:border-dawn focus:outline-none"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-gradient-to-l from-dawn to-gold text-white font-bold px-6 py-2.5 rounded-full text-sm hover:-translate-y-0.5 transition disabled:opacity-60"
          >
            {loading ? "جارٍ الإضافة..." : "إضافة"}
          </button>
        </div>
        {error && <p className="text-sm text-red-600 font-semibold mt-3">{error}</p>}
      </div>

      <div className="hover-lift animate-fade-up stagger-1 bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-extrabold text-night mb-4">أوقاتي المتاحة حاليًا</h3>
        {initialSlots.length === 0 ? (
          <p className="text-sm text-muted">لم تضف أي أوقات تواجد بعد. الطلاب لن يتمكنوا من حجز حصص معك حتى تضيف أوقاتًا.</p>
        ) : (
          <ul className="space-y-2">
            {initialSlots
              .slice()
              .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
              .map((s, i) => (
                <li
                  key={s.id}
                  className={`animate-scale-in stagger-${Math.min(i + 1, 6)} flex items-center justify-between bg-orange-50 rounded-xl px-4 py-3 text-sm`}
                >
                  <span className="font-semibold text-night">
                    {DAYS[s.dayOfWeek]} — من {s.startTime} إلى {s.endTime}
                  </span>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-red-600 font-bold text-xs hover:underline"
                  >
                    حذف
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
