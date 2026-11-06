"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { scheduleExport } from "@/i18n/dictionaries/scheduleExport";

export default function DownloadScheduleButton({
  teacherId,
  className = "",
}: {
  teacherId: string;
  className?: string;
}) {
  const { locale } = useLocale();
  const t = makeT(scheduleExport, locale);

  return (
    <a
      href={`/api/teachers/${teacherId}/schedule`}
      download
      className={`text-xs font-bold text-dawn hover:bg-amber-50 px-3 py-2 rounded-full transition inline-block ${className}`}
    >
      {t("downloadSchedule")}
    </a>
  );
}
