"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { student } from "@/i18n/dictionaries/student";

// Column order is always Sunday-first (index 0 = Sunday) to match
// `firstOfMonth.getDay()` below — only the direction (`dir`) and labels
// change per locale, never the column order, to avoid breaking the date math.
const WEEKDAY_LABELS: Record<"ar" | "en", string[]> = {
  ar: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};
const MONTH_LABELS: Record<"ar" | "en", string[]> = {
  ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function MonthCalendar({
  availableDateKeys,
  selectedDateKey,
  onSelect,
}: {
  availableDateKeys: Set<string>;
  selectedDateKey: string | null;
  onSelect: (key: string) => void;
}) {
  const { locale } = useLocale();
  const t = makeT(student, locale);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewMonth, setViewMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const firstOfMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const leadingBlanks = firstOfMonth.getDay(); // 0 = Sunday

  const cells: (Date | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i + 1)),
  ];

  const canGoPrev = viewMonth.getFullYear() > today.getFullYear() ||
    (viewMonth.getFullYear() === today.getFullYear() && viewMonth.getMonth() > today.getMonth());

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 select-none">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => canGoPrev && setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
          disabled={!canGoPrev}
          className="w-8 h-8 rounded-full flex items-center justify-center text-night hover:bg-orange-50 disabled:opacity-20 disabled:cursor-not-allowed transition"
          aria-label={t("prevMonth")}
        >
          ‹
        </button>
        <span className="font-extrabold text-night text-sm">
          {MONTH_LABELS[locale][viewMonth.getMonth()]} {viewMonth.getFullYear()}
        </span>
        <button
          type="button"
          onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
          className="w-8 h-8 rounded-full flex items-center justify-center text-night hover:bg-orange-50 transition"
          aria-label={t("nextMonth")}
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1" dir={dir}>
        {WEEKDAY_LABELS[locale].map((w) => (
          <div key={w} className="text-center text-[11px] font-bold text-muted py-1">
            {w.slice(0, 2)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1" dir={dir}>
        {cells.map((d, i) => {
          if (!d) return <div key={`blank-${i}`} />;
          const key = dateKey(d);
          const isAvailable = availableDateKeys.has(key);
          const isSelected = selectedDateKey === key;
          const isToday = dateKey(today) === key;
          return (
            <button
              key={key}
              type="button"
              disabled={!isAvailable}
              onClick={() => onSelect(key)}
              className={`aspect-square rounded-full text-sm font-semibold transition flex items-center justify-center
                ${isSelected ? "bg-dawn text-white shadow-md scale-105" : ""}
                ${!isSelected && isAvailable ? "text-night hover:bg-orange-50 cursor-pointer" : ""}
                ${!isAvailable ? "text-gray-300 cursor-not-allowed" : ""}
                ${isToday && !isSelected ? "ring-2 ring-dawn/40" : ""}
              `}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { dateKey };
