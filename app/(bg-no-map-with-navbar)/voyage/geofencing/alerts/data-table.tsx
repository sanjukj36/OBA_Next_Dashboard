"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function AlarmDataTable<TData, TValue>({
  columns,
  data
}: DataTableProps<TData, TValue>) {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: { pageIndex, pageSize }
    },
    pageCount: Math.ceil(data.length / pageSize),
    onPaginationChange: updater => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newState.pageIndex);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <>
      <Table
        className="border-separate border-spacing-y-2 p-2"
        style={{ "--r": "15px" } as React.CSSProperties}
      >
        <TableHeader className="bg-transparent">
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow
              key={headerGroup.id}
              className="rounded-[var(--r)] bg-black shadow-md shadow-black [&_th:first-child]:rounded-l-[var(--r)] [&_th:first-child]:border-l [&_th:last-child]:rounded-r-[var(--r)] [&_th:last-child]:border-r [&_th]:border-y [&_th]:border-white/40"
            >
              {headerGroup.headers.map(header => (
                <TableHead
                  key={header.id}
                  className="h-10 px-4 text-center font-russo text-xl"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="rounded-[var(--r)] shadow-md shadow-black [&_td:first-child]:rounded-l-[var(--r)] [&_td:first-child]:border-l [&_td:last-child]:rounded-r-[var(--r)] [&_td:last-child]:border-r [&_td]:border-y [&_td]:border-white/40"
                style={{
                  background:
                    "radial-gradient(50% 50% at 50% 50%, #000000 0%, #0F0F0F 52.4%, #000000 100%)"
                }}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell
                    key={cell.id}
                    className="h-10 px-4 py-0 text-center font-russo text-lg"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-10 text-center"
                style={{
                  background:
                    "radial-gradient(50% 50% at 50% 50%, #000000 0%, #0F0F0F 52.4%, #000000 100%)"
                }}
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        {/* //footer */}
        <TableFooter>
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="bg-gradient-to-r from-[#0C0C0C] to-[#0C0C0C]"
            >
              <div className="mt-4 flex items-center justify-between px-2 font-russo text-xl">
                <span>
                  Page {pageIndex + 1} of {table.getPageCount()}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    className="ms-4 cursor-pointer rounded-s-lg border-[0.5px] border-white bg-gradient-to-l from-[#1B1B1B] to-[#2F2F2F] px-2"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronLeft
                      size={30}
                      className="text-white drop-shadow-[0_1px_1px_#000000]"
                    />
                  </button>
                  <button
                    className="border-[0.5px] border-white bg-gradient-to-r from-[#1B1B1B] to-[#2F2F2F] px-4"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="drop-shadow-[0_1px_1px_#000000]">1</span>
                  </button>

                  <button
                    className="cursor-pointer rounded-r-lg border-[0.5px] border-white bg-gradient-to-r from-[#1B1B1B] to-[#2F2F2F] px-2"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <ChevronRight
                      size={30}
                      className="text-white drop-shadow-[0_1px_1px_#000000]"
                    />
                  </button>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
