"use client";

import { useEffect, useState } from "react";
import { PopoverContentProps } from "@radix-ui/react-popover";
import { CircleCheckBig, CirclePlus, Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { useAuth } from "@/provider/auth-provider";
import { useGetAllTagDetailsQuery } from "@/queries/use-all-taglist";
import { useGetTagDetailsQuery } from "@/queries/use-get-tag-details-query";
import { useTagAssignStore } from "@/store/tag-assign-form-store";
import { TagAssign, TagDataType } from "@/types/tag-assign";
import { MultiTagBoolForm } from "./multi-tag-form";
import {
  DgStatusResponseType,
  SingleTagDgStatusForm
} from "./single-tag-dg-status-form";
import { BoolResponseType, SingleTagBoolForm } from "./single-tag-form";

export type TagInfo<T = undefined> = {
  description: string;
  tag: OptionType | null;
  datatype: { label: TagDataType; value: TagDataType };
  unit: string;
  minimum: number;
  maximum: number;
  showOnlyDescription?: boolean;
} & (T extends undefined ? object : { response_type: T });

export type OptionType = {
  label: string;
  value: string;
};

export type IconStatus = "complete" | "incomplete";
export type FormType = "multiple" | "single" | "single-dg-status";
export const radioOptions = Object.values(TagDataType).map(value => ({
  label: value,
  value
}));

export function TagAssignComponent({
  type,
  tag,
  side = "right"
}: {
  type: FormType;
  tag: string;
  side?: PopoverContentProps["side"];
}) {
  const { showTagAssign } = useTagAssignStore();
  const { user } = useAuth();
  // if (!user?.is_superuser) {
  //   return null;
  // }
  
  if (!showTagAssign) {
    return null;
  }
  return <Component type={type} tag={tag} side={side} />;
}

function Component({
  type,
  tag,
  side
}: {
  type: FormType;
  tag: string;
  side: PopoverContentProps["side"];
}) {
  const { data, isLoading: tagDetailsLoading } = useGetTagDetailsQuery<
  DgStatusResponseType | BoolResponseType
  >(tag);
  const { data: allTagList, isLoading: allTagListLoading } =
  useGetAllTagDetailsQuery();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [iconStatus, setIconStatus] = useState<IconStatus>(
    data && data?.length > 0 ? "complete" : "incomplete"
  );
  
  const isLoading = tagDetailsLoading || allTagListLoading;
  console.log(data,tag);

  useEffect(() => {
    if (data && data?.length > 0) {
      setIconStatus("complete");
    } else {
      setIconStatus("incomplete");
    }
  }, [data]);

  return (
    <div className="absolute inset-0 z-50 grid place-items-center bg-black/70">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild disabled={isLoading}>
          {isLoading ? (
            <Badge variant="outline">
              <Loader
                strokeWidth={3}
                className="size-2 animate-spin 3xl:size-4"
              />
            </Badge>
          ) : iconStatus === "incomplete" ? (
            <Badge variant="info" className="cursor-pointer">
              <CirclePlus strokeWidth={3} className="size-2 3xl:size-4" />
            </Badge>
          ) : (
            <Badge variant="success" className="cursor-pointer">
              <CircleCheckBig strokeWidth={3} className="size-2 3xl:size-4" />
            </Badge>
          )}
        </PopoverTrigger>
        <PopoverContent
          onOpenAutoFocus={e => e.preventDefault()}
          onInteractOutside={e => {
            e.preventDefault();
            setModalState(true);
          }}
          className="w-auto rounded-lg border border-primary/50 bg-black/70 p-0 shadow-lg shadow-primary/10 outline-none backdrop-blur-sm transition-all duration-300"
          align="center"
          side={side}
          collisionPadding={{ top: 10, left: 10, right: 10, bottom: 10 }}
        >
          {type === "multiple" && !isLoading && (
            <MultiTagBoolForm
              label={tag}
              setPopoverOpen={setPopoverOpen}
              modalState={modalState}
              setModalState={setModalState}
              setIconStatus={setIconStatus}
              data={data as TagAssign<BoolResponseType>[]}
              allTagList={allTagList ?? []}
            />
          )}
          {type === "single" && !isLoading && (
            <SingleTagBoolForm
              label={tag}
              setPopoverOpen={setPopoverOpen}
              modalState={modalState}
              setModalState={setModalState}
              setIconStatus={setIconStatus}
              data={data ? (data[0] as TagAssign<BoolResponseType>) : undefined}
              allTagList={allTagList ?? []}
            />
          )}
          {type === "single-dg-status" && !isLoading && (
            <SingleTagDgStatusForm
              label={tag}
              setPopoverOpen={setPopoverOpen}
              modalState={modalState}
              setModalState={setModalState}
              setIconStatus={setIconStatus}
              data={
                data ? (data[0] as TagAssign<DgStatusResponseType>) : undefined
              }
              allTagList={allTagList ?? []}
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
