import MainLayout from "@components/MainLayout";
import { Disclosure, Transition } from "@headlessui/react";
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
import type { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo, useRef, useState, type ChangeEvent } from "react";
import styled, { keyframes } from "styled-components";
import { z } from "zod";
import { LoadingSpinner } from "~/components/ui/LoadingSpinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { usePlaylistStore } from "~/core/store";
import type { SearchResult } from "~/server/api/routers/spotify_user_router";
import type { PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";

const Search: PageWithLayout = () => {
  const searchInput = useRef<HTMLInputElement>(null);
  const { playlists } = usePlaylistStore();

  const { t } = useTranslation("search");
  const [error, setError] = useState(" ");
  // prettier-ignore
  const { data, mutate, isLoading } = api.spotify_user.searchTracks.useMutation();

  const columns: ColumnDef<SearchResult>[] = useMemo(() => {
    return [
      {
        accessorKey: "title",
        header: ({ column }) => {
          return (
            <button
              className="flex items-center justify-center gap-1"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t("search_table_headers.title") ?? "Title"}
              <ArrowSVG></ArrowSVG>
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
              <ArrowSVG></ArrowSVG>
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
              <ArrowSVG></ArrowSVG>
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
              <ArrowSVG></ArrowSVG>
            </button>
          );
        },
      },
      {
        id: 'tags',
        accessorFn: (row) => row.tags,
        header: ({ column }) => {
          return (
            <button
              className="flex items-center justify-center gap-1"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t("search_table_headers.tags") ?? "Tags"}
              <ArrowSVG></ArrowSVG>
            </button>
          );
        },
        
      },
    ];
  }, [])  


  const onSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(validateSearchInput(event.target.value));
  };

  const search = () => {
    if (searchInput.current)
      mutate({
        playlists: playlists,
        query: searchInput.current.value,
      });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="form-control w-full pb-4 sm:max-w-sm md:max-w-md">
        <div className="input-group">
          <input
            ref={searchInput}
            type="text"
            placeholder={t("search") ?? "..."}
            className="input-bordered input grow bg-secondary-content sm:max-w-sm"
            onChange={onSearchInputChange}
          />
          <button
            disabled={!!error}
            className="btn-square btn"
            onClick={search}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
        {!!error && (
          <label className="label text-red-700">
            <span className="label-text-alt font-bold text-error">
              {t(error)}
            </span>
          </label>
        )}
      </div>
      {isLoading && <LoadingSpinner />}
      {data && (
        <div className="flex w-full flex-col gap-2 p-1">
          <DataTable columns={columns} data={data} />
        </div>
      )}
    </div>
  );
};
export interface TableConfig {
  headers: string[];
  data: SearchResult[];
}
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
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
      <div className="mb-2 gap-2 rounded-lg bg-base-200 text-lg font-medium tracking-wide">
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
                      console.log(event.target.value);
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
                      console.log(event.target.value);
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
                      console.log(event.target.value);
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
                      (table
                        .getColumn("tags")
                        ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) => {
                      console.log(event.target.value);
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

      {/* <div className="collapse mb-2 rounded-lg">
        <input type="checkbox" className="peer" />
        <div
          className="collapse-title  peer-checked:text-secondary-content"
          onClick={() => setFilterOpen((open) => !open)}
        >
          {`Filters ${filterOpen ? "-" : "+"}`}
        </div>
        <div className="collapse-content"></div>
      </div> */}
      <Table className="table-compact table">
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
interface ArrowProps {
  isOpen?: boolean | undefined;
}


const rotate = keyframes`
  from {
    rotate: 0deg;
  }
  to {
    rotate: 180deg;
  }
`;
const reverseRotate = keyframes`
  from {
    rotate: 180deg;
  }
  to {
    rotate: 0deg;
  }
`;

const ArrowContainer = styled.div<ArrowProps>`
  animation: ${(p) => (p.isOpen !== undefined ? p.isOpen? rotate : reverseRotate : '')} 0.3s ease-in;
  rotate: ${(p) => (p.isOpen ? "180deg" : "0deg")}
`;


const ArrowSVG = ({ isOpen }: ArrowProps) => {
  const [open, setOpen] = useState<boolean | undefined>(undefined);

  return (
    <ArrowContainer
      className="flex items-center"
      isOpen={isOpen ? isOpen : open}
      onClick={() =>
        setOpen((open) => {
          if (open === undefined) return true;
          return !open;
        })
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 20"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-4 w-4 focus:rotate-180 "
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    </ArrowContainer>
  );
};


export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      //prettier- ignore
      ...(await serverSideTranslations(context.locale ?? "en", [
        "search",
        "common",
        "modals",
      ])),
    },
  };
};



Search.getLayout = (page) => <MainLayout>{page}</MainLayout>;

function validateSearchInput(searchInput: string) {
  let error = "";

  if (!z.string().min(2).safeParse(searchInput).success || !searchInput) {
    error = "search_errors.short";
  }
  if (!z.string().max(18).safeParse(searchInput).success) {
    error = "search_errors.long";
  }
  return error;
}

export default Search;