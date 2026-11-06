"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { leaderboard } from "@/i18n/dictionaries/leaderboard";
import AnimatedNumber from "./AnimatedNumber";
import { staggerDelay } from "@/lib/animation";

type StudentRow = { id: string; name: string; avatarEmoji: string; points: number; streak: number };
type TeacherRow = {
  id: string;
  name: string;
  avatarEmoji: string;
  points: number;
  rating: number;
  ratingCount: number;
};

const MEDAL = ["🥇", "🥈", "🥉"];
const RANK_COLOR = ["text-amber-500", "text-gray-400", "text-amber-700"];

export default function LeaderboardTabs({
  students,
  teachers,
}: {
  students: StudentRow[];
  teachers: TeacherRow[];
}) {
  const { locale } = useLocale();
  const t = makeT(leaderboard, locale);
  const [tab, setTab] = useState<"students" | "teachers">("students");

  return (
    <div className="space-y-6">
      <div className="inline-flex p-1 rounded-full bg-gray-100">
        <button
          onClick={() => setTab("students")}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
            tab === "students" ? "bg-white text-night shadow-sm" : "text-muted hover:text-night"
          }`}
        >
          🧑‍🎓 {t("studentsTab")}
        </button>
        <button
          onClick={() => setTab("teachers")}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
            tab === "teachers" ? "bg-white text-night shadow-sm" : "text-muted hover:text-night"
          }`}
        >
          👨‍🏫 {t("teachersTab")}
        </button>
      </div>

      {tab === "students" ? (
        students.length === 0 ? (
          <p className="text-sm text-muted">{t("noStudentsYet")}</p>
        ) : (
          <ul className="space-y-3">
            {students.map((s, i) => (
              <li
                key={s.id}
                style={{ animationDelay: staggerDelay(i) }}
                className="animate-fade-up rounded-2xl border border-gray-200 bg-gray-50 shadow-sm p-4 flex items-center justify-between flex-wrap gap-3 hover:bg-blue-50 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 text-center font-extrabold text-lg ${
                      i < 3 ? RANK_COLOR[i] : "text-muted"
                    }`}
                  >
                    {i < 3 ? MEDAL[i] : i + 1}
                  </span>
                  <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg shrink-0">
                    {s.avatarEmoji}
                  </span>
                  <p className="font-semibold text-sm">{s.name}</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="text-gold bg-amber-50 rounded-full px-3 py-1.5">
                    ⭐ <AnimatedNumber value={s.points} /> {t("pointsLabel")}
                  </span>
                  <span className="text-rose-500 bg-rose-50 rounded-full px-3 py-1.5">
                    🔥 <AnimatedNumber value={s.streak} /> {t("streakLabel")}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : teachers.length === 0 ? (
        <p className="text-sm text-muted">{t("noTeachersYet")}</p>
      ) : (
        <ul className="space-y-3">
          {teachers.map((tr, i) => (
            <li
              key={tr.id}
              style={{ animationDelay: staggerDelay(i) }}
              className="animate-fade-up rounded-2xl border border-gray-200 bg-gray-50 shadow-sm p-4 flex items-center justify-between flex-wrap gap-3 hover:bg-purple-50 hover:border-purple-300 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-8 text-center font-extrabold text-lg ${
                    i < 3 ? RANK_COLOR[i] : "text-muted"
                  }`}
                >
                  {i < 3 ? MEDAL[i] : i + 1}
                </span>
                <span className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-lg shrink-0">
                  {tr.avatarEmoji}
                </span>
                <p className="font-semibold text-sm">{tr.name}</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="text-teal-600 bg-teal-50 rounded-full px-3 py-1.5">
                  ⭐ <AnimatedNumber value={tr.rating} decimals={1} /> (<AnimatedNumber value={tr.ratingCount} /> {t("ratingsLabel")})
                </span>
                <span className="text-gold bg-amber-50 rounded-full px-3 py-1.5">
                  🏅 <AnimatedNumber value={tr.points} /> {t("pointsLabel")}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
