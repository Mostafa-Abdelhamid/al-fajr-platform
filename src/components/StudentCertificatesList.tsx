"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { certificates } from "@/i18n/dictionaries/certificates";
import { usePaginatedList } from "@/lib/usePaginatedList";
import Pagination from "./Pagination";
import { staggerDelay } from "@/lib/animation";
import type { Locale } from "@/i18n/config";

type Certificate = {
  id: string;
  type: string;
  title: string;
  createdAt: Date;
};

function formatDate(d: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

const PAGE_SIZE = 6;

export default function StudentCertificatesList({ certs }: { certs: Certificate[] }) {
  const { locale } = useLocale();
  const t = makeT(certificates, locale);
  const { page, setPage, totalPages, pageItems, totalCount } = usePaginatedList(certs, {
    pageSize: PAGE_SIZE,
  });

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {pageItems.map((c, i) => {
          const isMilestone = c.type === "MILESTONE";
          const iconBg = isMilestone ? "bg-amber-50" : "bg-purple-50";
          const iconColor = isMilestone ? "text-amber-600" : "text-purple-600";
          const icon = isMilestone ? "🏅" : "🎖️";
          const typeLabel = isMilestone ? t("milestoneType") : t("manualType");

          return (
            <div
              key={c.id}
              style={{ animationDelay: staggerDelay(i, 0.06) }}
              className="hover-lift animate-fade-up bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <span className={`w-12 h-12 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center text-2xl shrink-0`}>
                  {icon}
                </span>
                <div>
                  <p className={`text-xs font-bold ${iconColor}`}>{typeLabel}</p>
                  <p className="font-extrabold text-night text-sm">{c.title}</p>
                </div>
              </div>
              <p className="text-xs text-muted">
                {t("issuedOn")}: {formatDate(c.createdAt, locale)}
              </p>
              <a
                href={`/api/certificates/${c.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-2 bg-gradient-to-l from-dawn to-gold text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-md hover:-translate-y-0.5 transition-all"
              >
                {t("downloadPdf")}
              </a>
            </div>
          );
        })}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
        locale={locale}
        onPageChange={setPage}
      />
    </div>
  );
}
