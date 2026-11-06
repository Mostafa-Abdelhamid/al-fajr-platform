"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { dirForLocale } from "@/i18n/config";
import { makeT } from "@/i18n/t";
import { teacher, DAYS_AR, DAYS_EN, DAYS_SHORT_AR, DAYS_SHORT_EN } from "@/i18n/dictionaries/teacher";
import LoadingDots from "./LoadingDots";

type Slot = { id: string; dayOfWeek: number; startTime: string; endTime: string };

export default function AvailabilityManager({ initialSlots }: { initialSlots: Slot[] }) {
  const router = useRouter();
  const { locale } = useLocale();
  const t = makeT(teacher, locale);
  const DAYS = locale === "ar" ? DAYS_AR : DAYS_EN;
  const DAYS_SHORT = locale === "ar" ? DAYS_SHORT_AR : DAYS_SHORT_EN;
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
      setError(data.error || t("addFailed"));
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
        <h3 className="font-extrabold text-night mb-4">{t("addNewSlotTitle")}</h3>

        <label className="block text-xs font-bold text-muted mb-2">{t("dayLabel")}</label>
        <div className="flex flex-wrap gap-2 mb-5" dir={dirForLocale(locale)}>
          {DAYS_SHORT.map((d, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setDayOfWeek(i)}
              className={`w-12 h-12 rounded-full text-xs font-bold flex flex-col items-center justify-center transition ${
                dayOfWeek === i
                  ? "bg-dawn text-white shadow-md scale-105"
                  : "bg-gray-50 text-night hover:bg-amber-50"
              }`}
            >
              {locale === "ar" ? d.slice(0, 2) : d}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-bold text-muted mb-1">{t("fromLabel")}</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm focus:border-dawn focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted mb-1">{t("toLabel")}</label>
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
            {loading ? (
              <span className="inline-flex items-center gap-2">
                {t("adding")}
                <LoadingDots />
              </span>
            ) : (
              t("add")
            )}
          </button>
        </div>
        {error && <p className="text-sm text-red-600 font-semibold mt-3">{error}</p>}
      </div>

      <div className="hover-lift animate-fade-up stagger-1 bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-extrabold text-night mb-4">{t("currentSlotsTitle")}</h3>
        {initialSlots.length === 0 ? (
          <p className="text-sm text-muted">{t("noSlotsMessage")}</p>
        ) : (
          <ul className="space-y-2">
            {initialSlots
              .slice()
              .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
              .map((s, i) => (
                <li
                  key={s.id}
                  className={`animate-scale-in stagger-${Math.min(i + 1, 6)} flex items-center justify-between bg-amber-50 rounded-xl px-4 py-3 text-sm`}
                >
                  <span className="font-semibold text-night">
                    {DAYS[s.dayOfWeek]} {t("rangeFrom")} {s.startTime} {t("rangeTo")} {s.endTime}
                  </span>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-red-600 font-bold text-xs hover:underline"
                  >
                    {t("delete")}
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
