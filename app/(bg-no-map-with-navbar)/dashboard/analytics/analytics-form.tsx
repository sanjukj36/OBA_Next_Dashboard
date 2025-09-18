"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Loader, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  useDownloadAnalyticeExcelMutation,
  useGetAnalyticsMutation,
  useDownloadAnalyticeAllExcelMutation
} from "@/mutations/use-download-analytics-mutation";
import { DateTimePicker } from "./date-time-picker";
import { VirtualizedDropDownSelection } from "./virtulaized-drowpdonw-select";
import { VerticalDivider } from "@/components/layout/header";

export function AnalyticsForm() {
  const [from, setFromDate] = useState<Date>();
  const [to, setToDate] = useState<Date>();
  const [items, setItems] = useState<TagSelectionItems[]>([
    { id: 1, tag: null, scale: 1 },
  ]);

  return (
    <div className="relative isolate flex flex-col gap-8 rounded-[15px] p-4 pt-8 font-alexandria font-[400] leading-[100%] tracking-[0%]">
      <div className="gradient-border-2 absolute inset-0 -z-10 rounded-[15px] opacity-50" />
      <div className="flex flex-col gap-4">
        <Label className="text-[25px]">From Date(UTC)</Label>
        <DateTimePicker date={from} setDate={setFromDate} />
      </div>
      <div className="flex flex-col gap-4">
        <Label className="text-[25px]">To Date(UTC)</Label>
        <DateTimePicker date={to} setDate={setToDate} />
      </div>
      <TagSelectionWithScale items={items} setItems={setItems} />
      <SubmitButton from={from} to={to} items={items} />
      <div className="flex flex-col gap-4">
        <Label className="text-[25px]">Download as</Label>
        <div className="relative isolate flex min-h-16 w-full items-center justify-center gap-2 lg:gap-4  2xl:gap-6 border-none p-1 2xl:p-2 px-2 xl:px-4 text-left font-alexandria text-[12px] xl:text-[18px] font-normal leading-[100%] tracking-[0%] text-[#C9C9C9] shadow-[0px_4px_4px_0px_#000000]">
          <div className="absolute inset-0 -z-10 rounded-[10px] bg-[linear-gradient(2.2deg,_#000000_-322.96%,_#5C5C5C_78.1%)] opacity-50" />
          <DownloadExcelButton from={from} to={to} items={items} />
          <VerticalDivider />
          <DownloadAllExcelButton from={from} to={to} />
          {/*
          <DownlaodPdfButton />
          */}
        </div>
      </div>
    </div>
  );
}

function DownlaodPdfButton() {
  return (
    <button className="flex justify-center gap-4">
      <PdfIcon />
      <span className="mr-auto">PDF File</span>
    </button>
  );
}

function SubmitButton({
  from,
  to,
  items,
  ...props
}: React.ComponentProps<"button"> & {
  from: Date | undefined;
  to: Date | undefined;
  items: TagSelectionItems[];
}) {
  const { mutate, isPending } = useGetAnalyticsMutation();

  const handleClick = () => {
    const data = Object.fromEntries(
      items.filter(x => x.tag?.label).map(x => [x.tag!.label, x.scale])
    );

    if (!Object.entries(data).length)
      return toast.info("Tags with are missing.");
    if (!from) return toast.info("Missing From date");
    if (!to) return toast.info("Missing To date");

    mutate({
      from_date: from,
      to_date: to,
      data: data
    });
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className="ml-auto inline-flex items-center gap-2 rounded-[10px] border border-[#626262] bg-[linear-gradient(360deg,_#3F3F3F_-2.03%,_#6C6C6C_98.75%)] px-4 py-3 font-alexandria text-[20px] leading-[100%] tracking-[0%] text-[#ffffff] shadow-[3px_5px_9.4px_0px_#000000]"
    >
      {isPending ? (
        <>
          <Loader className="animate-spin" />
          <span className="mr-auto"> Loading...</span>
        </>
      ) : (
        <>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3 3.75C3 3.55109 3.07902 3.36032 3.21967 3.21967C3.36032 3.07902 3.55109 3 3.75 3H20.25C20.4489 3 20.6397 3.07902 20.7803 3.21967C20.921 3.36032 21 3.55109 21 3.75V10.5H19.5V4.5H4.5V19.5H7.5075V21H3.75C3.55109 21 3.36032 20.921 3.21967 20.7803C3.07902 20.6397 3 20.4489 3 20.25V3.75ZM20.991 13.998L14.211 20.7765C14.0704 20.9166 13.88 20.9953 13.6815 20.9953C13.483 20.9953 13.2926 20.9166 13.152 20.7765L9.387 17.0115L10.446 15.9495L13.6815 19.185L19.9305 12.936L20.991 13.998Z"
              fill="white"
            />
          </svg>
          <span>Submit</span>
        </>
      )}
    </button>
  );
}

function DownloadAllExcelButton({
  from,
  to,
}: {
  from: Date | undefined;
  to: Date | undefined;
}) {
  const { mutate, isPending } = useDownloadAnalyticeAllExcelMutation();

  const handleClick = () => {
    if (!from) return toast.info("Missing From date");
    if (!to) return toast.info("Missing To date");

    mutate({
      from_date: from,
      to_date: to,
    });
  };

  return (
    <button onClick={handleClick} className="flex justify-center gap-2 items-center">
      {isPending ? (
        <>
          <Loader className="animate-spin" />
          <span className="mr-auto"> Loading...</span>
        </>
      ) : (
        <>
          <ExcelIcon />
          <span className="mr-auto">(All Tags) </span>
        </>
      )}
    </button>
  );
}
function DownloadExcelButton({
  from,
  to,
  items
}: {
  from: Date | undefined;
  to: Date | undefined;
  items: TagSelectionItems[];
}) {
  const { mutate, isPending } = useDownloadAnalyticeExcelMutation();

  const handleClick = () => {
    const data = Object.fromEntries(
      items.filter(x => x.tag?.label).map(x => [x.tag!.label, x.scale])
    );

    if (!Object.entries(data).length)
      return toast.info("Tags with are missing.");
    if (!from) return toast.info("Missing From date");
    if (!to) return toast.info("Missing To date");

    mutate({
      from_date: from,
      to_date: to,
      data: data
    });
  };

  return (
    <button onClick={handleClick} className="flex justify-center gap-2 items-center">
      {isPending ? (
        <>
          <Loader className="animate-spin" />
          <span className="mr-auto"> Loading...</span>
        </>
      ) : (
        <>
          <ExcelIcon />
          <span className="mr-auto">(Selected Tags)</span>
        </>
      )}
    </button>
  );
}

function ExcelIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.6846 11.5133L6.38281 10.0508V20.8575C6.38271 20.975 6.4058 21.0913 6.45075 21.1998C6.4957 21.3083 6.56162 21.4069 6.64475 21.4899C6.72787 21.5729 6.82656 21.6387 6.93515 21.6834C7.04375 21.7282 7.16011 21.7511 7.27756 21.7508H21.6026C21.7201 21.7513 21.8367 21.7285 21.9454 21.6839C22.0542 21.6392 22.1531 21.5734 22.2363 21.4904C22.3196 21.4074 22.3857 21.3088 22.4307 21.2002C22.4758 21.0916 22.4989 20.9751 22.4988 20.8575V16.8758L14.6846 11.5133Z"
        fill="#185C37"
      />
      <path
        d="M14.6846 2.25H7.27756C7.16011 2.24971 7.04375 2.2726 6.93515 2.31736C6.82656 2.36213 6.72787 2.42789 6.64475 2.51088C6.56162 2.59386 6.4957 2.69244 6.45075 2.80096C6.4058 2.90947 6.38271 3.0258 6.38281 3.14325V7.125L14.6846 12L19.0803 13.4625L22.4988 12V7.125L14.6846 2.25Z"
        fill="#21A366"
      />
      <path d="M6.38281 7.125H14.6846V12H6.38281V7.125Z" fill="#107C41" />
      <path
        opacity="0.1"
        d="M12.3243 6.15039H6.38281V18.3379H12.3243C12.5611 18.3367 12.7878 18.2423 12.9554 18.0751C13.1231 17.9079 13.218 17.6814 13.2198 17.4446V7.04364C13.218 6.80689 13.1231 6.58038 12.9554 6.41318C12.7878 6.24598 12.5611 6.15157 12.3243 6.15039Z"
        fill="black"
      />
      <path
        opacity="0.2"
        d="M11.8361 6.63672H6.38281V18.8242H11.8361C12.0728 18.823 12.2996 18.7286 12.4672 18.5614C12.6348 18.3942 12.7298 18.1677 12.7316 17.931V7.52997C12.7298 7.29322 12.6348 7.06671 12.4672 6.89951C12.2996 6.73231 12.0728 6.6379 11.8361 6.63672Z"
        fill="black"
      />
      <path
        opacity="0.2"
        d="M11.8361 6.63672H6.38281V17.8492H11.8361C12.0728 17.848 12.2996 17.7536 12.4672 17.5864C12.6348 17.4192 12.7298 17.1927 12.7316 16.956V7.52997C12.7298 7.29322 12.6348 7.06671 12.4672 6.89951C12.2996 6.73231 12.0728 6.6379 11.8361 6.63672Z"
        fill="black"
      />
      <path
        opacity="0.2"
        d="M11.3478 6.63672H6.38281V17.8492H11.3478C11.5846 17.848 11.8113 17.7536 11.9789 17.5864C12.1466 17.4192 12.2415 17.1927 12.2433 16.956V7.52997C12.2415 7.29322 12.1466 7.06671 11.9789 6.89951C11.8113 6.73231 11.5846 6.6379 11.3478 6.63672Z"
        fill="black"
      />
      <path
        d="M2.3955 6.63672H11.349C11.5862 6.63652 11.8137 6.7305 11.9816 6.89799C12.1496 7.06549 12.2441 7.2928 12.2445 7.52997V16.4685C12.2441 16.7056 12.1496 16.933 11.9816 17.1005C11.8137 17.2679 11.5862 17.3619 11.349 17.3617H2.3955C2.27798 17.3621 2.16154 17.3393 2.05286 17.2946C1.94418 17.2499 1.84541 17.1841 1.7622 17.1011C1.679 17.0181 1.613 16.9195 1.56801 16.8109C1.52301 16.7024 1.4999 16.586 1.5 16.4685V7.52997C1.4999 7.41245 1.52301 7.29607 1.56801 7.1875C1.613 7.07894 1.679 6.98033 1.7622 6.89733C1.84541 6.81434 1.94418 6.74859 2.05286 6.70387C2.16154 6.65915 2.27798 6.63633 2.3955 6.63672Z"
        fill="url(#paint0_linear_4016_15495)"
      />
      <path
        d="M4.27344 14.9052L6.15669 11.9922L4.43169 9.0957H5.81694L6.75819 10.9505C6.84519 11.126 6.90819 11.2565 6.93669 11.3435H6.94944C7.01094 11.203 7.07594 11.0665 7.14444 10.934L8.15094 9.0987H9.42594L7.65669 11.9787L9.47094 14.9075H8.11419L7.02669 12.8742C6.97634 12.7867 6.93344 12.6951 6.89844 12.6005H6.88044C6.84865 12.6927 6.80638 12.7811 6.75444 12.8637L5.63469 14.9052H4.27344Z"
        fill="white"
      />
      <path
        d="M21.6063 2.25001H14.6875V7.125H22.5018V3.14325C22.5019 3.02573 22.4787 2.90935 22.4337 2.80079C22.3887 2.69222 22.3228 2.59361 22.2395 2.51061C22.1563 2.42762 22.0576 2.36187 21.9489 2.31715C21.8402 2.27243 21.7238 2.24961 21.6063 2.25001Z"
        fill="#33C481"
      />
      <path d="M14.6875 12H22.5018V16.875H14.6875V12Z" fill="#107C41" />
      <defs>
        <linearGradient
          id="paint0_linear_4016_15495"
          x1="3.3705"
          y1="5.93472"
          x2="10.374"
          y2="18.0637"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#18884F" />
          <stop offset="0.5" stopColor="#117E43" />
          <stop offset="1" stopColor="#0B6631" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 9H18.5L13 3.5V9ZM6 2H14L20 8V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V4C4 3.46957 4.21071 2.96086 4.58579 2.58579C4.96086 2.21071 5.46957 2 6 2ZM10.93 12.44C11.34 13.34 11.86 14.08 12.46 14.59L12.87 14.91C12 15.07 10.8 15.35 9.53 15.84L9.42 15.88L9.92 14.84C10.37 13.97 10.7 13.18 10.93 12.44ZM17.41 16.25C17.59 16.07 17.68 15.84 17.69 15.59C17.72 15.39 17.67 15.2 17.57 15.04C17.28 14.57 16.53 14.35 15.29 14.35L14 14.42L13.13 13.84C12.5 13.32 11.93 12.41 11.53 11.28L11.57 11.14C11.9 9.81 12.21 8.2 11.55 7.54C11.4693 7.46161 11.3738 7.40003 11.2691 7.35883C11.1644 7.31763 11.0525 7.29764 10.94 7.3H10.7C10.33 7.3 10 7.69 9.91 8.07C9.54 9.4 9.76 10.13 10.13 11.34V11.35C9.88 12.23 9.56 13.25 9.05 14.28L8.09 16.08L7.2 16.57C6 17.32 5.43 18.16 5.32 18.69C5.28 18.88 5.3 19.05 5.37 19.23L5.4 19.28L5.88 19.59L6.32 19.7C7.13 19.7 8.05 18.75 9.29 16.63L9.47 16.56C10.5 16.23 11.78 16 13.5 15.81C14.53 16.32 15.74 16.55 16.5 16.55C16.94 16.55 17.24 16.44 17.41 16.25ZM17 15.54L17.09 15.65C17.08 15.75 17.05 15.76 17 15.78H16.96L16.77 15.8C16.31 15.8 15.6 15.61 14.87 15.29C14.96 15.19 15 15.19 15.1 15.19C16.5 15.19 16.9 15.44 17 15.54ZM7.83 17C7.18 18.19 6.59 18.85 6.14 19C6.19 18.62 6.64 17.96 7.35 17.31L7.83 17ZM10.85 10.09C10.62 9.19 10.61 8.46 10.78 8.04L10.85 7.92L11 7.97C11.17 8.21 11.19 8.53 11.09 9.07L11.06 9.23L10.9 10.05L10.85 10.09Z"
        fill="#EF5350"
      />
    </svg>
  );
}

type TagOption = {
  value: string;
  label: string;
};
type TagSelectionItems = { id: number; tag: TagOption | null; scale: number };

function TagSelectionWithScale({
  items,
  setItems
}: {
  items: TagSelectionItems[];
  setItems: Dispatch<SetStateAction<TagSelectionItems[]>>;
}) {
  const addNewItem = () => {
    const newId = Math.max(...items.map(item => item.id), 0) + 1;
    setItems(prev => [ { id: newId, tag: null, scale: 1 }, ...prev]);
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateItem = (
    id: number,
    updates: Partial<Omit<TagSelectionItems, "id">>
  ) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  return (
    <div className="flex w-full flex-1 flex-col gap-4">
      <div className="flex w-full items-center justify-between">
        <Label className="text-[25px]">Tags</Label>
        <button onClick={addNewItem}>
          <Plus />
        </button>
      </div>
      <div className="grid max-h-[380px] w-full place-items-start gap-2 overflow-y-auto">
        {items.map(item => (
          <TagSelectionWithScaleItem
            key={item.id}
            item={item}
            onUpdate={updates => updateItem(item.id, updates)}
            onRemove={() => removeItem(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

function TagSelectionWithScaleItem({
  item,
  onUpdate,
  onRemove
}: {
  item: TagSelectionItems;
  onUpdate: (updates: Partial<Omit<TagSelectionItems, "id">>) => void;
  onRemove: () => void;
}) {
  const handleTagChange = (tag: TagOption | null) => {
    onUpdate({ tag });
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scale = Number(e.target.value);
    onUpdate({ scale });
  };

  return (
    <div className="relative isolate inline-flex min-h-16 w-full items-center justify-between gap-1 border-none p-2 px-4 text-left font-alexandria text-[22px] font-normal leading-[100%] tracking-[0%] text-[#C9C9C9] shadow-[0px_4px_4px_0px_#000000]">
      <div className="absolute inset-0 -z-10 rounded-[10px] bg-[linear-gradient(2.2deg,_#000000_-322.96%,_#5C5C5C_78.1%)] opacity-50" />
      <VirtualizedDropDownSelection
        selection={item.tag}
        setSelection={handleTagChange}
      />
      <input
        value={item.scale}
        onChange={handleScaleChange}
        className="w-[70px] rounded bg-transparent text-center outline-none focus:border-transparent focus:outline-black/50 focus:ring-0"
        type="number"
        placeholder="0"
      />
      <button
        onClick={onRemove}
        className="flex items-center justify-center rounded"
      >
        <Trash />
      </button>
    </div>
  );
}
