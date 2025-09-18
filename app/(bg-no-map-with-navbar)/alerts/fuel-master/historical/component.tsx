"use client";

import { VerticalDivider } from "@/components/layout/header";
import { FuelMasterListItem } from "@/types/alerts-fuelmaster";
import { useHistoricFuelmasterListQuery } from "@/queries/use-get-historic-fuelmaster-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Loader, } from "lucide-react";
import { useRef, useEffect } from "react";
import { formatLocaltoUtc } from "@/lib/utils";

export default function FuelMasterPageComponent() {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useHistoricFuelmasterListQuery({});
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loaderRef.current) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    })

    observer.observe(loaderRef.current)

    return () => observer.disconnect()

  }, [hasNextPage, fetchNextPage])

  if (isLoading) {
    return (
      <div className="mt-7 flex h-[80vh] flex-col items-center gap-3 overflow-y-auto pe-10 ps-4">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-7 flex h-[80vh] flex-col justify-start gap-3 overflow-y-auto pe-10 ps-4">
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Error.</AlertTitle>
          <AlertDescription>
            <p>{error.message ?? "Unkown Error occured."}</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isData = data && data.pages && data.pages.length > 0 && data.pages[0].pages.length > 0;
  const isFinishedPagination = !hasNextPage && data && data.pageParams.length > 1;

  return (
    <div className="mt-7 flex h-[80vh] flex-col gap-3 overflow-y-auto pe-10 ps-4 font-alexandria">
      {
        (isData)
          ? data.pages.flatMap((page) =>
            page.pages.map(item =>
              <FuelMastertAlertListItem key={item.id} {...item} />))
          : <p>No Data found.</p>
      }
      <div ref={loaderRef} className="flex justify-center py-4">
        {isFetchingNextPage
          ? <Loader className="animate-spin" />
          : null}
        {isFinishedPagination && <p className="text-sm text-gray-500">No more data</p>}
      </div>
    </div>
  );
}

type FuelMastertAlertListItemProps = FuelMasterListItem & {};
function FuelMastertAlertListItem({
  id,
  message,
  vesselTime
}: FuelMastertAlertListItemProps) {
  return (
    <div className="flex min-h-[41px] w-full items-center gap-4 rounded-[10px] border border-[#626262] bg-[radial-gradient(50%_50%_at_50%_50%,_#151515_0%,_#0F0F0F_52.4%,_#151515_100%)] px-4 py-1 font-alexandria">
      <span>{id}</span>
      <VerticalDivider />
      <span className="text-wrap">{message}</span>
      <span className="opacity-80 ml-auto">{formatLocaltoUtc(vesselTime, "dd-MM-yyyy HH:mm")}</span>
    </div>
  );
}
