"use client";

import { useEffect, useRef } from "react";
import { useHeaderShowStore } from "@/store/header-show";

export const HideHeaderIntersection = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const setHeaderShow = useHeaderShowStore(state => state.setShow);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          setHeaderShow(!entry.isIntersecting);
        });
      },
      {
        root: null,
        threshold: 0.5
      }
    );

    const { current: currentTarget } = ref;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [setHeaderShow]);

  return <div ref={ref} className="max-h-[1px] min-h-[1px] w-full"></div>;
};
