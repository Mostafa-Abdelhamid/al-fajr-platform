"use client";

import { useMemo, useState } from "react";

export function usePaginatedList<T>(
  items: T[],
  options?: {
    pageSize?: number;
    searchFn?: (item: T, query: string) => boolean;
    sortFns?: Record<string, (a: T, b: T) => number>;
    defaultSort?: string;
  }
) {
  const pageSize = options?.pageSize ?? 10;
  const searchFn = options?.searchFn;
  const sortFns = options?.sortFns;

  const [query, setQueryState] = useState("");
  const [sortKey, setSortKeyState] = useState(options?.defaultSort);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim() || !searchFn) return items;
    return items.filter((item) => searchFn(item, query.trim()));
  }, [items, query, searchFn]);

  const sorted = useMemo(() => {
    const sortFn = sortKey ? sortFns?.[sortKey] : undefined;
    if (!sortFn) return filtered;
    return [...filtered].sort(sortFn);
  }, [filtered, sortKey, sortFns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => sorted.slice((safePage - 1) * pageSize, safePage * pageSize),
    [sorted, safePage, pageSize]
  );

  function setQuery(next: string) {
    setQueryState(next);
    setPage(1);
  }

  function setSortKey(next: string | undefined) {
    setSortKeyState(next);
    setPage(1);
  }

  return {
    query,
    setQuery,
    sortKey,
    setSortKey,
    page: safePage,
    setPage,
    totalPages,
    pageItems,
    totalCount: sorted.length,
    pageSize,
  };
}
