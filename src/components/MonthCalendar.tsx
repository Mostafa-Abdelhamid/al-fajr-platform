"use client";

import { useState } from "react";

const WEEKDAY_LABELS = ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
const MONTH_LABELS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

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

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 select-none">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => canGoPrev && setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
          disabled={!canGoPrev}
          className="w-8 h-8 rounded-full flex items-center justify-center text-night hover:bg-orange-50 disabled:opacity-20 disabled:cursor-not-allowed transition"
          aria-label="الشهر السابق"
        >
          ‹
        </button>
        <span className="font-extrabold text-night text-sm">
          {MONTH_LABELS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
        </span>
        <button
          type="button"
          onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
          className="w-8 h-8 rounded-full flex items-center justify-center text-night hover:bg-orange-50 transition"
          aria-label="الشهر القادم"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1" dir="rtl">
        {WEEKDAY_LABELS.map((w) => (
          <div key={w} className="text-center text-[11px] font-bold text-muted py-1">
            {w.slice(0, 2)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1" dir="rtl">
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
