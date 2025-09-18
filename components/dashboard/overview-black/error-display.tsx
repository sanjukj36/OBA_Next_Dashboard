import { useState, memo, useEffect } from "react";
import { RotateCw, TriangleAlert, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

export const ErrorComponent = memo(function ErrorComponent({
  error,
  refetch
}: {
  error: string;
  refetch: () => void;
}) {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [closeError, setCloseError] = useState(true);

    useEffect(() => {
      const timeout = setTimeout(() => setShow(true), 200);
      return () => clearTimeout(timeout);
    }, [])

  if (!show || !closeError) {
    return null;
  }

  return (
    <div className="absolute inset-0 grid place-items-center rounded bg-black/60">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <TriangleAlert className="size-3 cursor-pointer text-destructive hover:text-destructive/80 3xl:size-4" />
        </PopoverTrigger>
        <PopoverContent
          side="top"
          className="flex w-full max-w-[250px] items-center gap-1 border-secondary/70 p-1 px-2 text-xxs lg:text-sm"
        >
          <div className="flex-1 text-wrap tracking-wide">
            <p className="text-sm font-semibold text-destructive">Error</p>
            <p className="text-sm font-thin">{error}</p>
          </div>
          <div className="flex flex-col justify-between gap-1">
            <Badge onClick={() => setCloseError(false)} variant="destructive">
              <X className="size-2 3xl:size-3" />
            </Badge>
            <Button onClick={refetch} variant="ghost" size="icon">
              <RotateCw />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
})
