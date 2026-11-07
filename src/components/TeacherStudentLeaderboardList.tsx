"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { leaderboard } from "@/i18n/dictionaries/leaderboard";
import { usePaginatedList } from "@/lib/usePaginatedList";
import { staggerDelay } from "@/lib/animation";
import Pagination from "./Pagination";
import AnimatedNumber from "./AnimatedNumber";

const MEDAL = ["🥇", "🥈", "🥉"];
const RANK_COLOR = ["text-amber-500", "text-gray-400", "text-amber-700"];

type StudentRow = { id: string; name: string; avatarEmoji: string; points: number; streak: number };

export default function TeacherStudentLeaderboardList({ students }: { students: StudentRow[] }) {
  const { locale } = useLocale();
  const t = makeT(leaderboard, locale);
  const { page, setPage, totalPages, pageItems, totalCount, pageSize } = usePaginatedList(students, {
    pageSize: 5,
  });

  return (
    <section className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
      <div className="mb-4">
        <h3 className="font-extrabold text-night">{t("myStudentsLeaderboardTitle")}</h3>
        <p className="text-xs text-muted mt-0.5">{t("myStudentsLeaderboardSubtitle")}</p>
      </div>
      {students.length === 0 ? (
        <p className="text-sm text-muted">{t("noLinkedStudentsYet")}</p>
      ) : (
        <>
          <ul className="space-y-3">
            {pageItems.map((s, i) => {
              const rank = (page - 1) * pageSize + i;
              return (
                <li
                  key={s.id}
                  style={{ animationDelay: staggerDelay(i) }}
                  className="animate-fade-up rounded-2xl border border-gray-200 bg-gray-50 shadow-sm p-3 flex items-center justify-between flex-wrap gap-3 hover:bg-blue-50 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 text-center font-extrabold ${rank < 3 ? RANK_COLOR[rank] : "text-muted"}`}>
                      {rank < 3 ? MEDAL[rank] : rank + 1}
                    </span>
                    <span className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-base shrink-0">
                      {s.avatarEmoji}
                    </span>
                    <p className="font-semibold text-sm">{s.name}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold">
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
          <Pagination
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            locale={locale}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
}
