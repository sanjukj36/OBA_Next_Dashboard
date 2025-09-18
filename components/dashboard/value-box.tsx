import Image from "next/image";
import valueBoxBgImage from "@/assets/value-box.png";
import { cn } from "@/lib/utils";

type ValueBoxComponentProps = {
  value: number;
  unit?: string;
};

export const ValueBoxComponent = (props: ValueBoxComponentProps) => {
  const valueLength = props.value.toString().length;
  const getValueFontSizes = (ln: number) => {
    switch (ln) {
      case 1:
        return "text-3xl";
      case 2:
        return "text-3xl";
      case 3:
        return "text-2xl";
      case 4:
        return "text-xl";
      default:
        return "text-lg";
    }
  };
  const valueFontSize = getValueFontSizes(valueLength);
  return (
    <div className="relative isolate flex aspect-[82/78] w-[82px] flex-col items-center justify-center font-din shadow-lg shadow-black">
      <Image
        src={valueBoxBgImage}
        alt="value box bg"
        className="pointer-events-none absolute inset-0 -z-10 select-none"
      />
      <p
        className={cn(
          "text-3xl font-bold text-shadow-custom-black-rgba",
          valueFontSize
        )}
      >
        {props.value}
      </p>
      {props.unit && (
        <p className="absolute bottom-[8%] text-xs">{props.unit}</p>
      )}
    </div>
  );
};
