"use client";

import { useMemo, useState } from "react";
import BookingCard from "./BookingCard";
import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { student } from "@/i18n/dictionaries/student";

const ALL = "__all__";

type Teacher = {
  id: string;
  name: string;
  avatarEmoji: string;
  qiraat: string[];
  bio: string;
  yearsExperience: number;
  rating: number;
  ratingCount: number;
  slots: string[];
};

export default function TeacherList({ teachers }: { teachers: Teacher[] }) {
  const { locale } = useLocale();
  const t = makeT(student, locale);
  const [filter, setFilter] = useState(ALL);

  const availableQiraat = useMemo(() => {
    return Array.from(new Set(teachers.flatMap((t) => t.qiraat))).sort((a, b) =>
      a.localeCompare(b, "ar")
    );
  }, [teachers]);

  const filtered = filter === ALL ? teachers : teachers.filter((t) => t.qiraat.includes(filter));

  return (
    <div className="space-y-5">
      {availableQiraat.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap animate-fade-up">
          <label className="text-sm font-bold text-night">{t("filterByQiraat")}</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border-2 border-gray-200 px-4 py-2 text-sm focus:border-dawn focus:ring-4 focus:ring-dawn/10 focus:outline-none transition-shadow"
          >
            <option value={ALL}>{t("allOption")}</option>
            {availableQiraat.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-muted text-sm">{t("noTeachersForQiraat")}</p>
      ) : (
        filtered.map((t) => (
          <BookingCard
            key={t.id}
            teacher={{
              id: t.id,
              name: t.name,
              avatarEmoji: t.avatarEmoji,
              qiraat: t.qiraat,
              bio: t.bio,
              yearsExperience: t.yearsExperience,
              rating: t.rating,
              ratingCount: t.ratingCount,
            }}
            slots={t.slots}
          />
        ))
      )}
    </div>
  );
}
