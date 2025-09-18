"use client"

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export function CancelOnRouteChange() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const activeQueriesRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const currentQueries = queryClient.getQueryCache().getAll();
    const currentQueryKeys = new Set(currentQueries.map(q => q.queryHash));

    activeQueriesRef.current.forEach(queryHash => {
      if(!currentQueryKeys.has(queryHash)) {
        queryClient.cancelQueries({ queryKey: JSON.parse(queryHash)})
      }
    })

    activeQueriesRef.current = currentQueryKeys;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, pathname, searchParams.toString()])

  return null
}
