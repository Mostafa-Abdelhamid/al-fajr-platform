"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { admin } from "@/i18n/dictionaries/admin";

export default function AdminPagination({
  page,
  totalPages,
  totalCount,
  pageSize,
}: {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const t = makeT(admin, locale);

  if (totalPages <= 1) return null;

  function goTo(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`${pathname}?${params.toString()}`);
  }

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);

  const pageNumbers: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pageNumbers.push(i);

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 pt-4 mt-4 border-t border-gray-100">
      <p className="text-xs text-muted">
        {t("showing")} {from}–{to} {t("of")} {totalCount}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          className="text-xs font-bold text-night bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-gray-50 rounded-lg px-3 py-2 transition"
        >
          {t("previous")}
        </button>
        {start > 1 && <span className="text-xs text-muted px-1">…</span>}
        {pageNumbers.map((n) => (
          <button
            key={n}
            onClick={() => goTo(n)}
            className={`text-xs font-bold rounded-lg w-8 h-8 transition ${
              n === page ? "bg-gradient-to-l from-dawn to-gold text-white" : "bg-gray-50 text-night hover:bg-gray-100"
            }`}
          >
            {n}
          </button>
        ))}
        {end < totalPages && <span className="text-xs text-muted px-1">…</span>}
        <button
          onClick={() => goTo(page + 1)}
          disabled={page >= totalPages}
          className="text-xs font-bold text-night bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-gray-50 rounded-lg px-3 py-2 transition"
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
}
