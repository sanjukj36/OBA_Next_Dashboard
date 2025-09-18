"use client";

import { ColumnDef } from "@tanstack/react-table";

export type AlertTableDataType = {
  no: number;
  tagName: string;
  time: string;
  details: string;
  status: 0 | 1;
};

export const columns: ColumnDef<AlertTableDataType>[] = [
  {
    accessorKey: "no",
    header: () => <div className="max-w-[100px] text-center text-white">NO</div>
  },
  {
    accessorKey: "tagName",
    header: () => (
      <div className="min-w-[200px] text-center text-white">Tag Name</div>
    )
  },
  {
    accessorKey: "time",
    header: () => <div className="text-center text-white">Time</div>
  },
  {
    accessorKey: "details",
    header: () => <div className="text-center text-white">Details</div>
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="max-w-[100px] text-center text-white">Status</div>
    )
  }
];
