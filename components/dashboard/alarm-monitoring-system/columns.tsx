"use client";

import { ColumnDef } from "@tanstack/react-table";

export type AlarmTableDataType = {
  registers: number;
  parmeters: string;
  value: number;
};

export const columns: ColumnDef<AlarmTableDataType>[] = [
  {
    accessorKey: "registers",
    header: () => (
      <div className="max-w-[300px] text-center text-white">Registers</div>
    )
  },
  {
    accessorKey: "parmeters",
    header: () => (
      <div className="min-w-[200px] text-center text-white">Parameters</div>
    )
  },
  {
    accessorKey: "value",
    header: () => (
      <div className="min-w-[200px] text-center text-white">Value</div>
    )
  }
];
