import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnFiltersState,
  type ColumnDef,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { type Playlist } from "~/types/spotify-types";
import FiltersComponent from "./FiltersComponent";
import TableBodyComponent from "./TableBodyComponent";
import PaginationComponent from "./PaginationComponent";

function PlaylistTable({ data}: {data: Playlist[]}) {
  const columns: ColumnDef<Playlist>[] = useMemo(() => {
    return [
      {
        accessorKey: "name",
      },
      {
        id: "creator",
        accessorFn: (row) => row.owner.display_name,
      },
    ];
  }, []);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <>
      <FiltersComponent table={table} />
      <TableBodyComponent table={table} data={data as Playlist[]} />
      <PaginationComponent table={table} />
    </>
  );
}
export default PlaylistTable