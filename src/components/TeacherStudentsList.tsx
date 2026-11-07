"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { teacher } from "@/i18n/dictionaries/teacher";
import { usePaginatedList } from "@/lib/usePaginatedList";
import Pagination from "./Pagination";
import IssueCertificateButton from "./IssueCertificateButton";
import ProgressForm from "./ProgressForm";

type StudentRow = { id: string; name: string; avatarEmoji: string };

export default function TeacherStudentsList({ students }: { students: StudentRow[] }) {
  const { locale } = useLocale();
  const t = makeT(teacher, locale);
  const { query, setQuery, page, setPage, totalPages, pageItems, totalCount, pageSize } = usePaginatedList(
    students,
    {
      pageSize: 8,
      searchFn: (s, q) => s.name.toLowerCase().includes(q.toLowerCase()),
    }
  );

  return (
    <section className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h3 className="font-extrabold text-night">{t("studentsTitle")}</h3>
        {students.length > 0 && (
          <div className="relative w-full sm:w-56">
            <span className="absolute start-4 top-1/2 -translate-y-1/2 text-muted">🔍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchStudentsPlaceholder")}
              className="w-full rounded-xl border-2 border-gray-200 ps-11 pe-4 py-2 text-xs focus:border-dawn focus:ring-4 focus:ring-dawn/10 focus:outline-none transition-shadow"
            />
          </div>
        )}
      </div>
      {students.length === 0 ? (
        <p className="text-sm text-muted">{t("noStudents")}</p>
      ) : pageItems.length === 0 ? (
        <p className="text-sm text-muted">{t("noStudentsMatchSearch")}</p>
      ) : (
        <>
          <ul className="divide-y">
            {pageItems.map((st) => (
              <li key={st.id} className="py-4">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <p className="font-semibold text-sm">
                    {st.avatarEmoji} {st.name}
                  </p>
                  <IssueCertificateButton studentId={st.id} studentName={st.name} />
                </div>
                <ProgressForm studentId={st.id} />
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
