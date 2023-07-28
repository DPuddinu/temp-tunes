import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { type Playlist } from "~/types/spotify-types";
import PaginationComponent from "../ui/PaginationComponent";
import FiltersComponent from "./FiltersComponent";
import TableBodyComponent from "./TableBodyComponent";

function PlaylistTable({ data }: { data: Playlist[] }) {
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
      <PaginationComponent
        onNext={() => table.nextPage()}
        onPrev={() => table.previousPage()}
        nextDisabled={!table.getCanNextPage()}
        prevDisabled={!table.getCanPreviousPage()}
      />
    </>
  );
}
export default PlaylistTable;