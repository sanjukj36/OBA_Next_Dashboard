import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type ProgressBarProps = {
  min: number;
  max: number;
  value: number;
  className?: string;
  showLabel?: boolean;
  color?: string; // Tailwind color like 'bg-blue-500'
};

export default function ProgressBar({
  min,
  max,
  value,
  className = ""
}: ProgressBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(140); // default fallback

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
      }
    };

    updateSize(); // initial run

    const observer = new ResizeObserver(() => updateSize());
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const clampedProgress = Math.min(max, Math.max(min, value));
  const progressPercent = ((clampedProgress - min) / (max - min)) * 100;

  const numberOfTicks = 11; // Including both ends
  const tickSpacing = containerWidth / (numberOfTicks - 1);

  return (
    <div
      ref={containerRef}
      className={twMerge("relative mx-auto h-[15px] w-[140px]", className)}
    >
      <div className="relative box-border h-full w-full overflow-hidden rounded-[5px] p-[1px] shadow-[0_0_1px_rgba(255,255,255,0.5)]">
        <div className="relative box-border h-full w-full overflow-hidden rounded-[4px] border-[1px] border-stone-300/50 3xl:border 3xl:border-stone-300">
          <div className="relative box-border h-full w-full overflow-hidden rounded-[4px] border border-black">
            <div
              className="h-full rounded-[3px] bg-gradient-to-r from-lime-950 via-green-800 to-lime-600"
              style={{ width: `${progressPercent}%` }}
            />
            {Array.from({ length: numberOfTicks }).map((_, index) => (
              <div
                key={index}
                className="absolute top-0 h-full w-px bg-black"
                style={{ left: `${index * tickSpacing}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
