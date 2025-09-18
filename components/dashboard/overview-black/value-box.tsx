import { cn } from "@/lib/utils";
import { RingBorder } from "./ring-border";

type ValueBoxComponentProps = {
  value: number;
  unit?: string;
};

export const ValueBoxComponent = (props: ValueBoxComponentProps) => {
  const valueLength = props.value.toString().length;

  const getValueFontSizes = (length: number) => {
    if (length >= 5) return "text-xs"; // 12px
    if (length === 4) return "text-sm"; // 14px
    if (length === 3) return "text-base"; // 16px
    if (length === 2) return "text-xl"; // 20px
    return "text-2xl lg:text-[20px]"; // 24px
  };
  const valueFontSize = getValueFontSizes(valueLength);
  return (
    <RingBorder
      variant="value-card"
      className="aspect-square lg:h-[60px] lg:w-[59px] xl:h-[59px] xl:w-[60px] 3xl:w-[80px]"
      innerClassName="flex flex-col items-center justify-center"
    >
      <p
        className={cn("font-bold text-shadow-custom-black-rgba", valueFontSize)}
      >
        {props.value}
      </p>
      {props.unit && <p className="text-[8px]">{props.unit}</p>}
    </RingBorder>
  );
};
