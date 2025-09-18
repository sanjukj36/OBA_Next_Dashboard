import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { twMerge } from "tailwind-merge";
import {
  AlertStatus,
  DgAlertStatus
} from "@/app/(bg-no-map-with-navbar)/ams/pms/pms";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  DgStatusResponseType,
  DgStatusValue,
  engineStatusList,
  engineStatusListItems
} from "./single-tag-dg-status-form";
import {
  boolResponseStatusList,
  boolResponseStatusListItems,
  BoolResponseStatusValue,
  BoolResponseType
} from "./single-tag-form";
import { VirtualizedCombobox } from "./virtualized-combobox";

type InputType = {
  label: string;
  info?: string;
  placeholder?: string;
  disabled?: boolean;
};

type NumberInput = {
  type: "number";
  value: number | string;
  onValueChange: (value: number | string) => void;
};

type TextInput = {
  type: "text";
  value: string;
  onValueChange: (value: string) => void;
};

export type SelectionType = { value: string; label: string };

type RadioInput = {
  type: "radio";
  value: SelectionType | null;
  onValueChange: (value: SelectionType) => void;
  options: SelectionType[];
};

type SelectionInput = {
  type: "select";
  value: SelectionType | null;
  onValueChange: (value: SelectionType) => void;
  options: SelectionType[];
};

type DgStatusInput = {
  type: "dg-status";
  value: DgStatusResponseType;
  onValueChange: (value: DgStatusResponseType) => void;
  options: SelectionType[];
};

type BoolStatusInput = {
  type: "bool-response";
  value: BoolResponseType;
  onValueChange: (value: BoolResponseType) => void;
  options: SelectionType[];
};

type PrimaryInputType = InputType & (NumberInput | TextInput);
type SecondaryInputType = InputType &
  (RadioInput | SelectionInput | DgStatusInput | BoolStatusInput);

type InputLabelComponentProps = PrimaryInputType | SecondaryInputType;

export function InputLabelComponent({
  label,
  info,
  placeholder,
  type,
  disabled = false,
  value,
  onValueChange,
  ...props
}: InputLabelComponentProps) {
  return (
    <div className="grid grid-cols-3 items-center">
      <Label
        className={cn("flex gap-1", {
          "cursor-not-allowed text-muted-foreground": disabled,
          "text-primary": !disabled
        })}
      >
        {label}
        {info && (
          <TooltipProvider delayDuration={0} disableHoverableContent>
            <Tooltip>
              <TooltipTrigger>
                <Info size={18} strokeWidth={3} />
              </TooltipTrigger>
              <TooltipContent className="max-w-56">{info}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </Label>
      {type === "text" && (
        <Input
          disabled={disabled}
          type="text"
          placeholder={placeholder}
          className="col-span-2 rounded-lg border-primary/50 text-xs"
          value={value}
          onChange={e => onValueChange(e.target.value)}
        />
      )}
      {type === "number" && (
        <Input
          disabled={disabled}
          type="number"
          placeholder={placeholder}
          className="col-span-2 rounded-lg border-primary/50 text-xs"
          value={value}
          onChange={e => {
            let inputValue = e.target.value;
            if (inputValue === "") {
              onValueChange(0);
              return;
            }
            if (inputValue.length > 1) {
              inputValue = inputValue.replace(/^0+/, "");
            }
            const parsed = parseInt(inputValue, 10);
            onValueChange(isNaN(parsed) ? 0 : parsed);
          }}
        />
      )}
      {type === "radio" && "options" in props && (
        <RadioInutComponent
          className="col-span-2"
          disabled={disabled}
          value={value}
          onValueChange={onValueChange}
          options={props.options}
        />
      )}
      {type === "select" && "options" in props && (
        <VirtualizedCombobox
          className="col-span-2 min-w-52"
          options={props.options}
          disabled={disabled}
          selectedOption={value}
          setSelectedOption={onValueChange}
        />
      )}
      {type === "dg-status" && (
        <DgStatusSelection
          className="col-span-2 min-w-52"
          disabled={disabled}
          onValueChange={onValueChange}
          value={value}
        />
      )}
      {type === "bool-response" && (
        <BoolResponseSelection
          className="col-span-2 min-w-52"
          onValueChange={onValueChange}
          value={value}
          disabled={disabled}
        />
      )}
    </div>
  );
}

interface BoolResponseSelectionProps {
  value: BoolResponseType;
  onValueChange: (value: BoolResponseType) => void;
  className?: string;
  disabled?: boolean;
}
export function BoolResponseSelection({
  value: selection,
  onValueChange: setSelection,
  disabled
}: BoolResponseSelectionProps) {
  const handleSelectionChange = (
    key: keyof BoolResponseType,
    value: BoolResponseStatusValue
  ) => {
    setSelection({
      ...selection,
      [key]: value
    });
  };

  return (
    <div className="col-span-2 flex flex-wrap justify-start gap-2">
      {boolResponseStatusListItems.map((responseItems, index) => {
        return (
          <div key={responseItems} className="flex items-center gap-1">
            <p className={twMerge("", disabled && "text-muted-foreground")}>
              {responseItems}
            </p>
            <Select
              disabled={disabled}
              defaultValue={engineStatusList[index]}
              onValueChange={(value: BoolResponseStatusValue) =>
                handleSelectionChange(responseItems, value)
              }
              value={selection[responseItems]}
            >
              <SelectTrigger className="transparent h-[25] w-[40px] rounded-none border-transparent border-b-muted-foreground px-0.5 py-0.5 outline-none ring-transparent focus:ring-0">
                <SelectValue className="text-xm border-transparent outline-none ring-transparent placeholder:text-muted-foreground focus:ring-transparent" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {boolResponseStatusList.map(item => {
                    return (
                      <SelectItem key={item} value={item}>
                        <AlertStatus className="size-[15px]" type={item} />
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        );
      })}
    </div>
  );
}
interface DgStatusSelectionProps {
  value: DgStatusResponseType;
  onValueChange: (value: DgStatusResponseType) => void;
  className?: string;
  disabled?: boolean;
}
function DgStatusSelection({
  value: selection,
  onValueChange: setSelection,
  disabled
}: DgStatusSelectionProps) {
  const handleSelectionChange = (
    key: keyof DgStatusResponseType,
    value: DgStatusValue
  ) => {
    setSelection({
      ...selection,
      [key]: value
    });
  };

  return (
    <div className="col-span-2 flex flex-wrap justify-start gap-2">
      {engineStatusListItems.map((responseItems, index) => {
        return (
          <div key={responseItems} className="flex items-center gap-1">
            <p className={twMerge("", disabled && "text-muted-foreground")}>
              {responseItems}
            </p>
            <Select
              disabled={disabled}
              defaultValue={engineStatusList[index]}
              onValueChange={(value: DgStatusValue) =>
                handleSelectionChange(responseItems, value)
              }
              value={selection[responseItems]}
            >
              <SelectTrigger className="transparent h-[25] w-[40px] rounded-none border-transparent border-b-muted-foreground px-0.5 py-0.5 outline-none ring-transparent focus:ring-0">
                <SelectValue className="text-xm border-transparent outline-none ring-transparent placeholder:text-muted-foreground focus:ring-transparent" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {engineStatusList.map(item => {
                    return (
                      <SelectItem key={item} value={item}>
                        <DgAlertStatus className="size-[15px]" type={item} />
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        );
      })}
    </div>
  );
}

interface RadioInutComponentProps {
  options: SelectionType[];
  value: SelectionType | null;
  onValueChange: (value: SelectionType) => void;
  className?: string;
  disabled?: boolean;
}

function RadioInutComponent({
  options,
  value,
  onValueChange,
  className,
  disabled
}: RadioInutComponentProps) {
  const [selection, setSelection] = useState(value?.value ?? "");

  useEffect(() => {
    setSelection(value ? value.value : "");
  }, [value]);
  useEffect(() => {
    if (selection !== value?.value) {
      const findSelection = options.find(option => option.value === selection);
      if (findSelection) {
        onValueChange(findSelection);
      }
    } else {
      setSelection(value.value);
    }
  }, [selection]);

  return (
    <RadioGroup
      disabled={disabled}
      className={twMerge("col-span-2 flex flex-wrap gap-4", className)}
      defaultValue={options[0].value}
      value={selection}
      onValueChange={setSelection}
    >
      {options.map(option => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem value={option.value} id={`radio-${option.value}`} />
          <Label htmlFor={`radio-${option.value}`} className="text-xs">
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

/*
    {addTagStatus ? (
      <Badge size="icon" variant="info">
        <CirclePlus size={18} strokeWidth={3} />
        <Loader className="animate-spin" size={16} strokeWidth={3} />
      </Badge>
    ) : (
      <Badge size="icon" variant="success">
          <Loader className="animate-spin" size={16} strokeWidth={3} />
        <CircleCheckBig size={16} strokeWidth={3} />
      </Badge>
    )}
 */
