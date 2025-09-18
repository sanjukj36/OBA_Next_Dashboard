"use client";

import { useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { AlertCircleIcon, Loader, } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { VerticalDivider } from "@/components/layout/header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { useAcknowledgeRealtimeFuelmasterAlarmMutation } from "@/mutations/use-realtime-fuelmaster-acknowledge-mutation";
import { useRealtimeFuelmasterListQuery } from "@/queries/use-get-realtime-fuelmaster-query";
import { FuelMasterListItem } from "@/types/alerts-fuelmaster";
import { useRef, useEffect } from "react";
import { formatLocaltoUtc } from "@/lib/utils";

export default function FuelMasterPageComponent() {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useRealtimeFuelmasterListQuery({});
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
    <div className="flex min-h-[41px] w-full items-center gap-4 rounded-[15px] border border-[#626262] bg-[radial-gradient(50%_50%_at_50%_50%,_#151515_0%,_#0F0F0F_52.4%,_#151515_100%)] px-4 py-1">
      <span>{id}</span>
      <VerticalDivider />
      <span className="text-wrap">{message}</span>
      <AcknowledgeButton className="ml-auto" id={id} />
      <span className="opacity-80 ml-auto">{formatLocaltoUtc(vesselTime, "dd-MM-yyyy HH:mm")}</span>
    </div>
  );
}

type AcknowledgeButtonProps = {
  id: number;
  className?: string;
};

const AcknowledgeButton: React.FC<AcknowledgeButtonProps> = ({
  id,
  className
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate, isPending } = useAcknowledgeRealtimeFuelmasterAlarmMutation();

  const handleConfirm = async () => {
    if (id === null) return;
    mutate(
      { id },
      {
        onSuccess: () => {
          setIsModalOpen(false);
        }
      }
    );
  };

  return (
    <>
      <button
        onClick={() => {
          setIsModalOpen(true);
        }}
        className={twMerge(
          "bg-custom-gradient-ok hover:bg-custom-gradient flex cursor-pointer items-center justify-center rounded-[10px] px-4 py-2 shadow-md transition-all",
          className
        )}
      >
        <span className="font-alexandria leading-[100%] tracking-[0%] text-white">
          Acknowledge
        </span>
      </button>

      {/* Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogOverlay className="bg-black/50 backdrop-blur-[2px]" />
        <DialogTitle />
        <DialogContent
          className="w-full max-w-md rounded-[12px] border border-[#626262] bg-[linear-gradient(90deg,_#1B1B1B_0%,_#2F2F2F_100%)] p-6 shadow-md"
          showCloseButton={false}
        >
          {/* Centered Text */}
          <div className="mt-[29px] flex items-center justify-center text-center">
            <p className="text-[25px] text-white">
              Are you sure you want to acknowledge this?{" "}
            </p>
          </div>

          <div className="mb-3 mt-6 flex justify-center gap-28 ">
            <Button
              variant="secondary"
              onClick={handleConfirm}
              className="h-[34px] min-w-[76px] border border-[#626262] bg-black"
            >
              {isPending ? (
                <>
                  <Loader className="animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                "Yes"
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              className="h-[34px] w-[76px] border border-[#626262] bg-black"
            >
              No
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
