"use client";

const LABELS = {
  ar: { previous: "السابق", next: "التالي", of: "من", showing: "عرض" },
  en: { previous: "Previous", next: "Next", of: "of", showing: "Showing" },
};

export default function Pagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  locale,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalCount?: number;
  pageSize?: number;
  locale: "ar" | "en";
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  const t = LABELS[locale];

  const pageNumbers: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pageNumbers.push(i);

  const from = totalCount !== undefined && pageSize ? (page - 1) * pageSize + 1 : null;
  const to = totalCount !== undefined && pageSize ? Math.min(page * pageSize, totalCount) : null;

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 pt-4 mt-4 border-t border-gray-100">
      {from !== null && to !== null ? (
        <p className="text-xs text-muted">
          {t.showing} {from}–{to} {t.of} {totalCount}
        </p>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="text-xs font-bold text-night bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-gray-50 rounded-lg px-3 py-2 transition"
        >
          {t.previous}
        </button>
        {start > 1 && <span className="text-xs text-muted px-1">…</span>}
        {pageNumbers.map((n) => (
          <button
            key={n}
            onClick={() => onPageChange(n)}
            className={`text-xs font-bold rounded-lg w-8 h-8 transition ${
              n === page ? "bg-gradient-to-l from-dawn to-gold text-white" : "bg-gray-50 text-night hover:bg-gray-100"
            }`}
          >
            {n}
          </button>
        ))}
        {end < totalPages && <span className="text-xs text-muted px-1">…</span>}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="text-xs font-bold text-night bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-gray-50 rounded-lg px-3 py-2 transition"
        >
          {t.next}
        </button>
      </div>
    </div>
  );
}
