"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { student } from "@/i18n/dictionaries/student";
import { usePaginatedList } from "@/lib/usePaginatedList";
import Pagination from "./Pagination";
import RateTeacherForm from "./RateTeacherForm";

type HistorySession = {
  id: string;
  startAt: Date;
  teacherNotes: string;
  rating: number | null;
  studentRating: number | null;
  teacher: { name: string; avatarEmoji: string };
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

export default function StudentHistoryList({ sessions }: { sessions: HistorySession[] }) {
  const { locale } = useLocale();
  const t = makeT(student, locale);
  const { page, setPage, totalPages, pageItems, totalCount, pageSize } = usePaginatedList(sessions, {
    pageSize: 5,
  });

  if (sessions.length === 0) {
    return <p className="text-sm text-muted">{t("historyEmpty")}</p>;
  }

  return (
    <>
      <ul className="space-y-4">
        {pageItems.map((s) => (
          <li key={s.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-semibold text-sm">
                  {s.teacher.avatarEmoji} {s.teacher.name}
                </p>
                <p className="text-xs text-muted">{formatDateTime(s.startAt, locale)}</p>
                {s.teacherNotes && (
                  <p className="text-xs text-muted mt-1">
                    {t("teacherNotePrefix")} {s.teacherNotes}
                  </p>
                )}
              </div>
              {s.rating && (
                <span className="text-gold font-bold text-sm">
                  {"★".repeat(s.rating)}
                  {"☆".repeat(5 - s.rating)}
                </span>
              )}
            </div>
            <div className="mt-3">
              <RateTeacherForm sessionId={s.id} teacherName={s.teacher.name} initialStudentRating={s.studentRating} />
            </div>
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
  );
}
