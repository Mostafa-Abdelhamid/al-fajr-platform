"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { report } from "@/i18n/dictionaries/report";

export default function DownloadReportButton({
  studentId,
  className = "",
}: {
  studentId: string;
  className?: string;
}) {
  const { locale } = useLocale();
  const t = makeT(report, locale);

  return (
    <a
      href={`/api/students/${studentId}/report`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-gradient-to-l from-dawn to-gold text-white font-bold px-5 py-2.5 rounded-full shadow-lg shadow-amber-300/40 hover:-translate-y-0.5 hover:shadow-amber-300/60 transition-all text-sm ${className}`}
    >
      {t("downloadReport")}
    </a>
  );
}
