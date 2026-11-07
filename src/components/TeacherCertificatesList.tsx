"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { teacher } from "@/i18n/dictionaries/teacher";
import { usePaginatedList } from "@/lib/usePaginatedList";
import Pagination from "./Pagination";
import AnimatedNumber from "./AnimatedNumber";

type CertRow = {
  id: string;
  title: string;
  createdAt: Date;
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

export default function TeacherCertificatesList({ certificates }: { certificates: CertRow[] }) {
  const { locale } = useLocale();
  const t = makeT(teacher, locale);
  const { page, setPage, totalPages, pageItems, totalCount, pageSize } = usePaginatedList(certificates, {
    pageSize: 5,
  });

  return (
    <section className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-extrabold text-night">{t("issuedCertificatesTitle")}</h3>
        <span className="text-xs font-bold text-muted bg-gray-100 rounded-full px-2.5 py-1">
          <AnimatedNumber value={totalCount} />
        </span>
      </div>
      {certificates.length === 0 ? (
        <p className="text-sm text-muted">{t("noIssuedCertificates")}</p>
      ) : (
        <>
          <ul className="divide-y">
            {pageItems.map((c) => (
              <li key={c.id} className="py-3 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-base shrink-0">
                    🎖️
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{c.title}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {c.student.avatarEmoji} {c.student.name} • {t("certificateIssuedOn")}{" "}
                      {formatDateTime(c.createdAt, locale)}
                    </p>
                  </div>
                </div>
                <a
                  href={`/api/certificates/${c.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-dawn hover:bg-amber-50 px-3 py-2 rounded-full transition shrink-0"
                >
                  📄
                </a>
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
