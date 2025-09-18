import { twMerge } from "tailwind-merge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { OptionType } from "./multi-tag-form";

interface CustomSelectProps {
  options: OptionType[];
  selection: OptionType | null;
  setSelection: (selection: OptionType) => void;
  placeholder?: string;
  className?: string;
}
export const CustomSelect = ({
  options,
  selection,
  setSelection,
  placeholder,
  className
}: CustomSelectProps) => {
  return (
    <Select
      value={selection?.value ?? ""}
      onValueChange={value => {
        const selection = options.find(x => x.value === value);
        if (selection) {
          setSelection(selection);
        }
      }}
    >
      <SelectTrigger className={twMerge("w-[180px]", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
