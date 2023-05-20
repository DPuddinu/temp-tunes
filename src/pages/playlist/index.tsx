import { ColumnDef, ColumnFiltersState, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo, useState } from "react";
import MainLayout from "~/components/MainLayout";
import { ArrowSVG } from "~/components/ui/icons/ArrowSVG";
import { usePlaylistStore } from "~/core/store";
import { PageWithLayout } from "~/types/page-types";
import { Playlist } from "~/types/spotify-types";

const PlaylistsPage: PageWithLayout = () => {

  const { playlists } = usePlaylistStore();
  const { t } = useTranslation("playlists");

  const columns: ColumnDef<Playlist>[] = useMemo(() => {
    return [
      {
        accessorKey: "name",
      },
      {
        id:'owner',
        accessorFn: (row) => row.owner.display_name,
      }
    ];
  }, []); 


  return <div className="p-4 flex items-center justify-center">{
    playlists && playlists.length > 0 ? <DataTable columns={columns} data={playlists}></DataTable> : <p>No Data!</p>
  }
    
  </div>;
};

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
    <div>
      <div className=" grid w-full sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-x-auto">
        {table.getRowModel().rows?.length ? (
          table
            .getRowModel()
            .rows.map((row) => (
              <PlaylistComponent
                key={row.id}
                creator={(row.original as Playlist).owner.display_name}
                imageUrl={(row.original as Playlist).images[0]?.url ?? ""}
                name={(row.original as Playlist).name}
              ></PlaylistComponent>
            ))
        ) : (
          <div>No results</div>
        )}
      </div>
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

interface PlaylistComponentProps{
  name:string;
  creator: string;
  imageUrl:string;
}
function PlaylistComponent({name, creator, imageUrl}: PlaylistComponentProps) {
  return (
    <div className="flex rounded-2xl border-base-300 bg-base-200 shadow">
      <div className="h-20 w-20 min-w-[5rem]">
        <img
          src={imageUrl}
          className="aspect-square h-full w-full rounded-xl"
        ></img>
      </div>
      <div className="flex flex-col px-2 justify-center gap-2 truncate">
        <p className="font-semibold truncate">{name}</p>
        <p className="text-sm truncate">{creator}</p>
      </div>
    </div>
  );
}

export default PlaylistsPage

PlaylistsPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      //prettier- ignore
      ...(await serverSideTranslations(context.locale ?? "en", [
        "playlists",
      ])),
    },
  };
};