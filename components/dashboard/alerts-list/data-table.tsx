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

export function AlertDataTable<TData, TValue>({
  columns,
  data
}: DataTableProps<TData, TValue>) {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 5;
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
    <div>
      <Table
        style={
          {
            "--r": "15px"
          } as React.CSSProperties
        }
        className="border-separate border-spacing-y-2 p-2"
      >
        <TableHeader className="bg-transparent">
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow
              className="rounded-[var(--r)] bg-black shadow-md shadow-black [&_th:first-child]:rounded-l-[var(--r)] [&_th:first-child]:border-l [&_th:last-child]:rounded-r-[var(--r)] [&_th:last-child]:border-r [&_th]:border-y [&_th]:border-white/40"
              key={headerGroup.id}
            >
              {headerGroup.headers.map(header => {
                return (
                  <TableHead
                    key={header.id}
                    className="h-10 px-4 font-russo text-xl"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow
                style={{
                  background:
                    "radial-gradient(50% 50% at 50% 50%, #000000 0%, #0F0F0F 52.4%, #000000 100%)"
                }}
                className="rounded-[var(--r)] shadow-md shadow-black [&_td:first-child]:rounded-l-[var(--r)] [&_td:first-child]:border-l [&_td:last-child]:rounded-r-[var(--r)] [&_td:last-child]:border-r [&_td]:border-y [&_td]:border-white/40"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell
                    className="h-10 px-4 py-0 font-russo text-lg"
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                style={{
                  background:
                    "radial-gradient(50% 50% at 50% 50%, #000000 0%, #0F0F0F 52.4%, #000000 100%)"
                }}
                colSpan={columns.length}
                className="h-10 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        {/* //footer */}
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns.length} className="bg-card-foreground">
              <div className="mt-4 flex items-center justify-between px-2 font-russo text-xl">
                <span>
                  Page {pageIndex + 1} of {table.getPageCount()}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    className="max-w-[170px] rounded-sm border border-white/30 bg-gradient-to-r from-black to-stone-900/50 px-4 py-1 text-center text-input"
                    type="text"
                    placeholder="Enter Page"
                  />
                  <button
                    className="ms-4 cursor-pointer rounded-s-lg border border-white/50 bg-gradient-to-l from-black to-stone-900/50 px-2"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronLeft size={30} />
                  </button>
                  <button
                    className="border border-white/50 bg-gradient-to-r from-black to-stone-900/50 px-4"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    1
                  </button>

                  <button
                    className="cursor-pointer rounded-r-lg border border-white/50 bg-gradient-to-r from-black to-stone-900/50 px-2"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <ChevronRight size={30} />
                  </button>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
