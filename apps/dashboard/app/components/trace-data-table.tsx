"use client";

import * as React from "react";
import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Input } from "@ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/components/table";

export type Trace = {
  Timestamp: string;
  ServiceName: string;
  Duration: number;
  SpanKind: string;
  StatusCode: string;
  SpanName: string;
  TraceId: string;
};

export const columns: ColumnDef<Trace>[] = [
  {
    accessorKey: "Timestamp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center">
        <div className="h-4 w-1 bg-green-500 mr-2"></div>
        <div>{new Date(row.getValue("Timestamp")).toLocaleString()}</div>
      </div>
    ),
  },
  {
    accessorKey: "Duration",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Duration
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{`${row.getValue("Duration")} ms`}</div>,
  },
  {
    accessorKey: "SpanName",
    header: "Span Name",
    cell: ({ row }) => (
      <div className="text-green-500">{row.getValue("SpanName")}</div>
    ),
  },
  {
    accessorKey: "SpanKind",
    header: "Kind",
    cell: ({ row }) => {
      const kind = row.getValue("SpanKind") as string;
      const bgColor = kind === "INTERNAL" ? "bg-purple-500" : "bg-blue-500";
      return (
        <div
          className={`${bgColor} text-white px-2 py-1 rounded text-xs inline-block`}
        >
          {kind}
        </div>
      );
    },
  },
  {
    accessorKey: "StatusCode",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("StatusCode") as string;
      const bgColor =
        status === "STATUS_CODE_OK" ? "bg-green-500" : "bg-red-500";
      return (
        <div
          className={`${bgColor} text-white px-2 py-1 rounded text-xs inline-block`}
        >
          {status}
        </div>
      );
    },
  },
];

interface TraceDataTableProps {
  serviceName: string;
}

export default function TraceDataTable({ serviceName }: TraceDataTableProps) {
  const [data, setData] = React.useState<Trace[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  React.useEffect(() => {
    async function fetchTraceData() {
      try {
        const response = await fetch(
          `/api/trace-details?serviceName=${encodeURIComponent(serviceName)}`
        );
        const traceData = await response.json();
        setData(traceData);
      } catch (error) {
        console.error("Error fetching trace data:", error);
      }
    }

    fetchTraceData();
  }, [serviceName]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full bg-zinc-900 text-zinc-100">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter span names..."
          value={
            (table.getColumn("SpanName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("SpanName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-zinc-800 text-zinc-100 border-zinc-700"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto bg-zinc-800 text-zinc-100 border-zinc-700"
            >
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-zinc-800 text-zinc-100 border-zinc-700"
          >
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border border-zinc-700">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-zinc-700 hover:bg-zinc-800"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-zinc-400">
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-zinc-700 hover:bg-zinc-800"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-zinc-400">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="bg-zinc-800 text-zinc-100 border-zinc-700"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="bg-zinc-800 text-zinc-100 border-zinc-700"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
