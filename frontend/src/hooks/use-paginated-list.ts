import { useEffect, useState } from "react";

import type { PageResult } from "@/lib/pagination";

type FetchPage<T> = (
  page: number,
  signal: AbortSignal,
) => Promise<PageResult<T>>;

export function usePaginatedList<T>(fetchPage: FetchPage<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [requestVersion, setRequestVersion] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetchPage(page, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setItems((current) =>
          page === 0 ? result.content : [...current, ...result.content],
        );
        setHasMore(!result.last);
        setTotalElements(result.totalElements);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [fetchPage, page, requestVersion]);

  return {
    items,
    hasMore,
    totalElements,
    loading,
    error,
    loadMore: () => {
      if (!loading && !error && hasMore) {
        setLoading(true);
        setPage((current) => current + 1);
      }
    },
    retry: () => {
      setError(false);
      setLoading(true);
      setRequestVersion((current) => current + 1);
    },
    reload: () => {
      setItems([]);
      setHasMore(false);
      setError(false);
      setLoading(true);
      setPage(0);
      setRequestVersion((current) => current + 1);
    },
  };
}
