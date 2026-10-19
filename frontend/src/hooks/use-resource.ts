import { useEffect, useState } from "react";

import { ApiError } from "@/lib/api-client";

type ResourceState<T> = {
  id: string | undefined;
  requestVersion: number;
  data: T | null;
  error: number | null;
};

export function useResource<T>(
  id: string | undefined,
  fetchResource: (id: string, signal: AbortSignal) => Promise<T>,
) {
  const [state, setState] = useState<ResourceState<T>>({
    id,
    requestVersion: 0,
    data: null,
    error: null,
  });
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    fetchResource(id, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ id, requestVersion, data, error: null });
        }
      })
      .catch((caught) => {
        if (!controller.signal.aborted) {
          setState({
            id,
            requestVersion,
            data: null,
            error: caught instanceof ApiError ? caught.status : 0,
          });
        }
      });

    return () => controller.abort();
  }, [id, fetchResource, requestVersion]);

  const current =
    state.id === id && state.requestVersion === requestVersion
      ? state
      : { id, requestVersion, data: null, error: null };

  return {
    data: id ? current.data : null,
    loading: Boolean(id) && current.data === null && current.error === null,
    error: id ? current.error : 404,
    retry: () => setRequestVersion((version) => version + 1),
    replace: (data: T) => setState({ id, requestVersion, data, error: null }),
  };
}
