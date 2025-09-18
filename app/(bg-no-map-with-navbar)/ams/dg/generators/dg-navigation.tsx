"use client";

import NumberTitleCard from "@/components/ams/ams-dark-them/title-card/number-title-card";

export const DgNavigation = () => {
  return (
    <div className="flex flex-wrap justify-between">
      <NumberTitleCard title={1} queryparams="dg-1" label="DG-NAV-1" />
      <NumberTitleCard title={2} queryparams="dg-2" label="DG-NAV-2"/>
      <NumberTitleCard title={3} queryparams="dg-3" label="DG-NAV-3"/>
      <NumberTitleCard title={4} queryparams="dg-4" label="DG-NAV-4"/>
    </div>
  );
};
