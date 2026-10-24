"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MonthCalendar, { dateKey } from "./MonthCalendar";

type Teacher = {
  id: string;
  name: string;
  avatarEmoji: string;
  qiraat: string[];
  bio: string;
  yearsExperience: number;
  rating: number;
  ratingCount: number;
};

export default function BookingCard({ teacher, slots }: { teacher: Teacher; slots: string[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [surahFocus, setSurahFocus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const slotsByDate = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const s of slots) {
      const key = dateKey(new Date(s));
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return map;
  }, [slots]);

  const availableDateKeys = useMemo(() => new Set(slotsByDate.keys()), [slotsByDate]);
  const firstAvailableDate = slots.length > 0 ? dateKey(new Date(slots[0])) : null;

  const [selectedDate, setSelectedDate] = useState<string | null>(firstAvailableDate);
  const [selected, setSelected] = useState<string>(slots[0] || "");

  const timesForSelectedDate = selectedDate ? slotsByDate.get(selectedDate) || [] : [];

  function handleSelectDate(key: string) {
    setSelectedDate(key);
    const times = slotsByDate.get(key) || [];
    setSelected(times[0] || "");
  }

  async function handleBook() {
    if (!selected) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/sessions/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teacherId: teacher.id, startAt: selected, surahFocus }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "تعذر الحجز");
      setLoading(false);
      return;
    }
    router.push("/student/dashboard");
    router.refresh();
  }

  return (
    <div className="hover-lift bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex gap-3">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-2xl">
            {teacher.avatarEmoji}
          </div>
          <div>
            <h3 className="font-extrabold text-night">{teacher.name}</h3>
            <p className="text-sm text-dawn font-semibold">{teacher.qiraat.join("، ")}</p>
            <p className="text-xs text-muted mt-1 max-w-sm">{teacher.bio}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted">
              <span>⭐ {teacher.rating.toFixed(1)} ({teacher.ratingCount} تقييم)</span>
              <span>📘 {teacher.yearsExperience} سنوات خبرة</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="bg-gradient-to-l from-dawn to-gold text-white font-bold px-5 py-2.5 rounded-full text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
        >
          {open ? "إغلاق" : "عرض المواعيد والحجز"}
        </button>
      </div>

      {open && (
        <div className="mt-5 border-t pt-5 animate-fade-up">
          {slots.length === 0 ? (
            <p className="text-sm text-muted">لا توجد مواعيد متاحة حاليًا لهذا المعلم.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-night mb-2">اختر يومًا</label>
                <MonthCalendar
                  availableDateKeys={availableDateKeys}
                  selectedDateKey={selectedDate}
                  onSelect={handleSelectDate}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-night mb-2">اختر وقتًا</label>
                {timesForSelectedDate.length === 0 ? (
                  <p className="text-sm text-muted">اختر يومًا من التقويم لعرض الأوقات المتاحة.</p>
                ) : (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {timesForSelectedDate.map((s) => {
                      const d = new Date(s);
                      const label = new Intl.DateTimeFormat("ar-SA", {
                        hour: "numeric",
                        minute: "2-digit",
                      }).format(d);
                      return (
                        <button
                          key={s}
                          onClick={() => setSelected(s)}
                          className={`text-xs font-bold px-3 py-2 rounded-xl border-2 transition ${
                            selected === s
                              ? "border-dawn bg-orange-50 text-dawn"
                              : "border-gray-200 text-muted hover:border-gray-300"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}

                <label className="block text-sm font-bold text-night mb-2">
                  ما الذي تريد التركيز عليه؟ (اختياري)
                </label>
                <input
                  value={surahFocus}
                  onChange={(e) => setSurahFocus(e.target.value)}
                  placeholder="مثال: سورة البقرة، مراجعة التجويد..."
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm mb-4 focus:border-dawn focus:outline-none"
                />

                {error && <p className="text-sm text-red-600 font-semibold mb-3">{error}</p>}

                <button
                  onClick={handleBook}
                  disabled={loading || !selected}
                  className="w-full sm:w-auto bg-night text-white font-bold px-6 py-3 rounded-full text-sm hover:-translate-y-0.5 transition disabled:opacity-50"
                >
                  {loading ? "جارٍ الحجز..." : "تأكيد الحجز"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
