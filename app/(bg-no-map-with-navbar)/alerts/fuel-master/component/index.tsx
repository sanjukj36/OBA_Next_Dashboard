import React from "react";
import { AlertTabSelection  } from "./tag-selection";
import { DateRangeSelection } from "./date-range-selection";
import { SortingComponent } from "./sorting-component";
import { SearchFilter } from "./search-filter";

export function AlertPageTableHeaderSection() {

  return (
    <div className="flex w-full flex-row items-center justify-start gap-4 py-4 ps-4 pe-10">
      <AlertTabSelection />
      <DateRangeSelection />
      <SortingComponent />
      <SearchFilter />
    </div>
  );
};
