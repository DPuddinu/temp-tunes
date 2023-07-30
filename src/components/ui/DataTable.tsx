import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import Accordion from "./Accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./TableComponent";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation("search");
  const { t: commonTranslate } = useTranslation("common");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full">
      <Accordion className="mb-6">
        <Accordion.Header>{commonTranslate("filter")}</Accordion.Header>
        <Accordion.Content>
          <div className="flex flex-wrap gap-2 rounded-b-lg bg-base-200 p-4 md:flex-nowrap">
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">
                  {t("search_table_headers.title")}
                </span>
              </label>
              <input
                value={
                  (table.getColumn("title")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("title")?.setFilterValue(event.target.value)
                }
                type="text"
                placeholder=""
                className="input-bordered input w-full max-w-xs"
              />
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">
                  {t("search_table_headers.author")}
                </span>
              </label>
              <input
                value={
                  (table.getColumn("artists")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) => {
                  table
                    .getColumn("artists")
                    ?.setFilterValue(event.target.value);
                }}
                type="text"
                placeholder=""
                className="input-bordered input w-full max-w-xs"
              />
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">
                  {t("search_table_headers.playlist")}
                </span>
              </label>
              <input
                value={
                  (table.getColumn("playlist")?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) => {
                  table
                    .getColumn("playlist")
                    ?.setFilterValue(event.target.value);
                }}
                type="text"
                placeholder=""
                className="input-bordered input w-full max-w-xs"
              />
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">
                  {t("search_table_headers.creator")}
                </span>
              </label>
              <input
                value={
                  (table.getColumn("creator")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) => {
                  table
                    .getColumn("creator")
                    ?.setFilterValue(event.target.value);
                }}
                type="text"
                placeholder=""
                className="input-bordered input w-full max-w-xs"
              />
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">
                  {t("search_table_headers.tags")}
                </span>
              </label>
              <input
                value={
                  (table.getColumn("tags")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) => {
                  table.getColumn("tags")?.setFilterValue(event.target.value);
                }}
                type="text"
                placeholder=""
                className="input-bordered input w-full max-w-xs"
              />
            </div>
          </div>
        </Accordion.Content>
      </Accordion>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {flexRender(
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
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="btn-group mt-3 flex justify-center">
        <div className="flex">
          <button
            className="btn  bg-neutral"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button
            className="btn"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
