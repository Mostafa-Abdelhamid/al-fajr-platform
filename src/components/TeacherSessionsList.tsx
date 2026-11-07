"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { teacher } from "@/i18n/dictionaries/teacher";
import { usePaginatedList } from "@/lib/usePaginatedList";
import Pagination from "./Pagination";
import AnimatedNumber from "./AnimatedNumber";

type SessionRow = {
  id: string;
  startAt: Date;
  surahFocus: string;
  rating?: number | null;
  student: { avatarEmoji: string; name: string };
};

function formatDateTime(d: Date, locale: "ar" | "en") {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export default function TeacherSessionsList({
  sessions,
  variant,
}: {
  sessions: SessionRow[];
  variant: "upcoming" | "missed" | "completed";
}) {
  const { locale } = useLocale();
  const t = makeT(teacher, locale);
  const isMissed = variant === "missed";
  const isUpcoming = variant === "upcoming";
  const isCompleted = variant === "completed";
  const pageSize = isCompleted ? 8 : 6;
  const { page, setPage, totalPages, pageItems, totalCount } = usePaginatedList(sessions, { pageSize });

  if (isMissed && sessions.length === 0) return null;

  return (
    <section
      className={`hover-lift animate-fade-up ${isUpcoming ? "stagger-3 " : ""}bg-white rounded-2xl border p-6 ${
        isMissed ? "border-red-200" : "border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-night">
            {t(isUpcoming ? "upcomingSessionsTitle" : isMissed ? "missedTitle" : "recentCompletedTitle")}
          </h3>
          {isMissed && (
            <span className="text-xs font-bold text-red-700 bg-red-100 rounded-full px-2.5 py-1">
              <AnimatedNumber value={totalCount} />
            </span>
          )}
        </div>
        {isUpcoming && (
          <Link href="/teacher/availability" className="text-sm text-dawn font-bold">
            {t("manageAvailabilityLink")}
          </Link>
        )}
      </div>
      {isMissed && <p className="text-xs text-muted -mt-2 mb-4">{t("missedDesc")}</p>}

      {pageItems.length === 0 ? (
        <p className="text-sm text-muted">{t(isUpcoming ? "noUpcoming" : "noCompleted")}</p>
      ) : (
        <>
          <ul className="divide-y">
            {pageItems.map((s) => (
              <li key={s.id} className="py-3 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-semibold text-sm">
                    {s.student.avatarEmoji} {s.student.name}
                  </p>
                  <p className="text-xs text-muted">
                    {formatDateTime(s.startAt, locale)}
                    {!isCompleted && s.surahFocus && ` • ${s.surahFocus}`}
                  </p>
                </div>
                {isUpcoming && (
                  <Link
                    href={`/session/${s.id}`}
                    className="bg-gradient-to-l from-dawn to-gold text-white font-bold text-sm px-5 py-2 rounded-full hover:-translate-y-0.5 hover:shadow-lg transition-all"
                  >
                    {t("enterSession")}
                  </Link>
                )}
                {isMissed && (
                  <Link
                    href={`/session/${s.id}`}
                    className="bg-red-100 text-red-800 font-bold text-sm px-5 py-2 rounded-full hover:bg-red-200 transition"
                  >
                    {t("finishSession")}
                  </Link>
                )}
                {isCompleted && s.rating && (
                  <span className="text-gold font-bold text-sm">
                    {"★".repeat(s.rating)}
                    {"☆".repeat(5 - s.rating)}
                  </span>
                )}
              </li>
            ))}
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
