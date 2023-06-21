import { Disclosure, Transition } from "@headlessui/react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type ColumnFiltersState, type SortingState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./TableComponent";
import type { SearchResult } from "~/server/api/routers/spotify_user_router";
import { ArrowSVG } from "./icons/index";
import { useTranslation } from "next-i18next";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function SearchTable({ data }: { data: SearchResult[] }) {
  const { t } = useTranslation("search");
  const columns: ColumnDef<SearchResult>[] = useMemo(() => {
    return [
      {
        accessorKey: "title",
        header: ({ column }) => {
          return (
            <button
              className="flex w-full items-center gap-1"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t("search_table_headers.title") ?? "Title"}
              <ArrowSVG isOpen={column.getIsSorted()}></ArrowSVG>
            </button>
          );
        },
      },
      {
        accessorKey: "artists",
        header: ({ column }) => {
          return (
            <button
              className="flex items-center justify-center gap-1"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t("search_table_headers.author") ?? "Author"}
              <ArrowSVG isOpen={column.getIsSorted()}></ArrowSVG>
            </button>
          );
        },
      },
      {
        accessorKey: "playlist",
        header: ({ column }) => {
          return (
            <button
              className="flex items-center justify-center gap-1"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t("search_table_headers.playlist") ?? "playlist"}
              <ArrowSVG isOpen={column.getIsSorted()}></ArrowSVG>
            </button>
          );
        },
      },

      {
        accessorKey: "creator",
        header: ({ column }) => {
          return (
            <button
              className="flex items-center justify-center gap-1"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t("search_table_headers.creator") ?? "Creator"}
              <ArrowSVG isOpen={column.getIsSorted()}></ArrowSVG>
            </button>
          );
        },
      },
      {
        accessorKey: "tags",
        header: ({ column }) => {
          return (
            <button
              className="flex items-center justify-center gap-1"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t("search_table_headers.tags") ?? "Tags"}
              <ArrowSVG isOpen={column.getIsSorted()}></ArrowSVG>
            </button>
          );
        },
      },
    ];
  }, [t]);
  return <DataTable columns={columns} data={data} />;
}


function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [filterOpen, setFilterOpen] = useState(false);
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
    <div className=" w-full overflow-x-auto ">
      <div
        key="filters"
        className="mb-2 gap-2 rounded-lg bg-base-200 text-lg font-medium tracking-wide"
      >
        <Disclosure>
          <Disclosure.Button>
            <div onClick={() => setFilterOpen((open) => !open)} className="p-4">
              {`Filters ${filterOpen ? "-" : "+"}`}
            </div>
          </Disclosure.Button>

          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel>
              <div className="flex flex-wrap gap-2 rounded-b-lg bg-base-200 p-4 md:flex-nowrap">
                <div className="form-control w-full max-w-xs">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    value={
                      (table.getColumn("title")?.getFilterValue() as string) ??
                      ""
                    }
                    onChange={(event) =>
                      table
                        .getColumn("title")
                        ?.setFilterValue(event.target.value)
                    }
                    type="text"
                    placeholder=""
                    className="input-bordered input w-full max-w-xs"
                  />
                </div>
                <div className="form-control w-full max-w-xs">
                  <label className="label">
                    <span className="label-text">Artists</span>
                  </label>
                  <input
                    value={
                      (table
                        .getColumn("artists")
                        ?.getFilterValue() as string) ?? ""
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
                    <span className="label-text">Playlist</span>
                  </label>
                  <input
                    value={
                      (table
                        .getColumn("playlist")
                        ?.getFilterValue() as string) ?? ""
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
                    <span className="label-text">Creator</span>
                  </label>
                  <input
                    value={
                      (table
                        .getColumn("creator")
                        ?.getFilterValue() as string) ?? ""
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
                    <span className="label-text">Tags</span>
                  </label>
                  <input
                    value={
                      (table.getColumn("tags")?.getFilterValue() as string) ??
                      ""
                    }
                    onChange={(event) => {
                      table
                        .getColumn("tags")
                        ?.setFilterValue(event.target.value);
                    }}
                    type="text"
                    placeholder=""
                    className="input-bordered input w-full max-w-xs"
                  />
                </div>
              </div>
            </Disclosure.Panel>
          </Transition>
        </Disclosure>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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


export default SearchTable;