import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

type SelectDropdownProps = {
  placeholder?: string;
  options?: { value: string; label: string }[];
  value?: { value: string | number; label: string; id?: number };
  className?: string;
  onValueChange?: (value: { value: string; label: string }) => void;
};

export function SelectDropdown({
  placeholder,
  options,
  value,
  className,
  onValueChange
}: SelectDropdownProps) {
  return (
    <Select
      value={value?.value ?? ""}
      onValueChange={val => {

        const selectedOption = options?.find(option => option.value == val);
        if (selectedOption) {
          onValueChange?.(selectedOption);
        } else {
          // If value is empty or invalid
          onValueChange?.({ value: "", label: "" });
        }
      }}
    >
      {/* <SelectTrigger className="flex w-[270px] border-transparent bg-transparent py-0 text-[50px] text-black shadow-none transition-colors file:border-0 file:bg-transparent file:text-[40px] file:font-medium file:text-foreground placeholder:text-black focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:pe-10 disabled:opacity-50 disabled:shadow-none md:text-sm"> */}
      <SelectTrigger className={className ? className : ""}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="border-card-foreground font-alexandria text-white/80">
        <SelectGroup>
          {options?.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
