import type { ColumnDef } from "@tanstack/react-table";
import { ArrowSVG } from "../ui/icons";

export function getTagColumns(
  t: (x: string) => string
): ColumnDef<unknown, unknown>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <button
            className="flex w-full items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("search_table_headers.title") ?? "Title"}
            <ArrowSVG isOpen={column.getIsSorted()} />
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("search_table_headers.author") ?? "Author"}
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("search_table_headers.tags") ?? "Tags"}
            <ArrowSVG isOpen={column.getIsSorted()}></ArrowSVG>
          </button>
        );
      },
    },
  ];
}

export function getTrackColumns(
  t: (x: string) => string
): ColumnDef<unknown, unknown>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <button
            className="flex w-full items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("search_table_headers.title") ?? "Title"}
            <ArrowSVG isOpen={column.getIsSorted()} />
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("search_table_headers.creator") ?? "Creator"}
            <ArrowSVG isOpen={column.getIsSorted()}></ArrowSVG>
          </button>
        );
      },
    },
  ];
}
