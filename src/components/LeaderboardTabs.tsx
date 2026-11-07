"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { leaderboard } from "@/i18n/dictionaries/leaderboard";
import AnimatedNumber from "./AnimatedNumber";
import Pagination from "./Pagination";
import { usePaginatedList } from "@/lib/usePaginatedList";
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

function byNameSearch<T extends { name: string }>(item: T, query: string) {
  return item.name.toLowerCase().includes(query.toLowerCase());
}

const STUDENT_SORT_FNS: Record<string, (a: StudentRow, b: StudentRow) => number> = {
  points: (a, b) => b.points - a.points,
  streak: (a, b) => b.streak - a.streak,
};

const TEACHER_SORT_FNS: Record<string, (a: TeacherRow, b: TeacherRow) => number> = {
  points: (a, b) => b.points - a.points,
  rating: (a, b) => b.rating - a.rating,
};

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative w-full sm:w-64">
      <span className="absolute start-4 top-1/2 -translate-y-1/2 text-muted">🔍</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border-2 border-gray-200 ps-11 pe-4 py-2.5 text-sm focus:border-dawn focus:ring-4 focus:ring-dawn/10 focus:outline-none transition-shadow"
      />
    </div>
  );
}

function SortPills({
  sortKey,
  onChange,
  label,
  options,
}: {
  sortKey: string | undefined;
  onChange: (key: string) => void;
  label: string;
  options: { key: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-bold text-muted">{label}:</span>
      <div className="inline-flex p-1 rounded-full bg-gray-100">
        {options.map((o) => (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              sortKey === o.key ? "bg-white text-night shadow-sm" : "text-muted hover:text-night"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

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

  const studentList = usePaginatedList(students, {
    pageSize: 10,
    searchFn: byNameSearch,
    sortFns: STUDENT_SORT_FNS,
    defaultSort: "points",
  });

  const teacherList = usePaginatedList(teachers, {
    pageSize: 10,
    searchFn: byNameSearch,
    sortFns: TEACHER_SORT_FNS,
    defaultSort: "points",
  });

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
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <SearchInput value={studentList.query} onChange={studentList.setQuery} placeholder={t("searchPlaceholder")} />
              <SortPills
                sortKey={studentList.sortKey}
                onChange={studentList.setSortKey}
                label={t("sortByLabel")}
                options={[
                  { key: "points", label: t("sortByPoints") },
                  { key: "streak", label: t("sortByStreak") },
                ]}
              />
            </div>

            {studentList.pageItems.length === 0 ? (
              <p className="text-sm text-muted">{t("noSearchResults")}</p>
            ) : (
              <ul className="space-y-3">
                {studentList.pageItems.map((s, i) => {
                  const rank = (studentList.page - 1) * studentList.pageSize + i;
                  return (
                    <li
                      key={s.id}
                      style={{ animationDelay: staggerDelay(i) }}
                      className="animate-fade-up rounded-2xl border border-gray-200 bg-gray-50 shadow-sm p-4 flex items-center justify-between flex-wrap gap-3 hover:bg-blue-50 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 text-center font-extrabold text-lg ${
                            rank < 3 ? RANK_COLOR[rank] : "text-muted"
                          }`}
                        >
                          {rank < 3 ? MEDAL[rank] : rank + 1}
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
                  );
                })}
              </ul>
            )}

            <Pagination
              page={studentList.page}
              totalPages={studentList.totalPages}
              totalCount={studentList.totalCount}
              pageSize={studentList.pageSize}
              locale={locale}
              onPageChange={studentList.setPage}
            />
          </div>
        )
      ) : teachers.length === 0 ? (
        <p className="text-sm text-muted">{t("noTeachersYet")}</p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <SearchInput value={teacherList.query} onChange={teacherList.setQuery} placeholder={t("searchPlaceholder")} />
            <SortPills
              sortKey={teacherList.sortKey}
              onChange={teacherList.setSortKey}
              label={t("sortByLabel")}
              options={[
                { key: "points", label: t("sortByPoints") },
                { key: "rating", label: t("sortByRating") },
              ]}
            />
          </div>

          {teacherList.pageItems.length === 0 ? (
            <p className="text-sm text-muted">{t("noSearchResults")}</p>
          ) : (
            <ul className="space-y-3">
              {teacherList.pageItems.map((tr, i) => {
                const rank = (teacherList.page - 1) * teacherList.pageSize + i;
                return (
                  <li
                    key={tr.id}
                    style={{ animationDelay: staggerDelay(i) }}
                    className="animate-fade-up rounded-2xl border border-gray-200 bg-gray-50 shadow-sm p-4 flex items-center justify-between flex-wrap gap-3 hover:bg-purple-50 hover:border-purple-300 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 text-center font-extrabold text-lg ${
                          rank < 3 ? RANK_COLOR[rank] : "text-muted"
                        }`}
                      >
                        {rank < 3 ? MEDAL[rank] : rank + 1}
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
                );
              })}
            </ul>
          )}

          <Pagination
            page={teacherList.page}
            totalPages={teacherList.totalPages}
            totalCount={teacherList.totalCount}
            pageSize={teacherList.pageSize}
            locale={locale}
            onPageChange={teacherList.setPage}
          />
        </div>
      )}
    </div>
  );
}
