import { Disclosure, Transition } from "@headlessui/react";
import { ColumnDef, ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo, useState } from "react";
import MainLayout from "~/components/MainLayout";
import { DropdownMenu } from "~/components/ui/DropdownMenu";
import { CopySVG } from "~/components/ui/icons/CopySVG";
import { DeleteSVG } from "~/components/ui/icons/DeleteSVG";
import { MergeSVG } from "~/components/ui/icons/MergeSVG";
import { PencilSVG } from "~/components/ui/icons/PencilSVG";
import { ShuffleSVG } from "~/components/ui/icons/ShuffleSVG";
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
        id:'creator',
        accessorFn: (row) => row.owner.display_name,
      }
    ];
  }, []); 

  return <div className="flex flex-col w-full items-center">{
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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [filterOpen, setFilterOpen] = useState(false);
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
      <div
        key="filters"
        className="mb-4 w-full gap-2 rounded-lg bg-base-200 text-lg font-medium tracking-wide lg:w-3/4"
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
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    value={
                      (table.getColumn("name")?.getFilterValue() as string) ??
                      ""
                    }
                    onChange={(event) =>
                      table
                        .getColumn("name")
                        ?.setFilterValue(event.target.value)
                    }
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
              </div>
            </Disclosure.Panel>
          </Transition>
        </Disclosure>
      </div>
      <div className="lg:w-3/4 grid w-full gap-4  overflow-x-auto pb-10 sm:grid-cols-2 md:grid-cols-3">
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
      <div className="lg:w-3/4 btn-group mt-3 flex justify-center">
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
    </>
  );
}

interface PlaylistComponentProps{
  name:string;
  creator: string;
  imageUrl:string;
}

function PlaylistComponent({name, creator, imageUrl}: PlaylistComponentProps) {
  const { t } = useTranslation("playlists");

  return (
    <div className="group flex max-h-20 items-center rounded-2xl border-base-300 bg-base-200 shadow">
      <div className="h-20 w-20 min-w-[5rem]">
        <img
          src={imageUrl}
          className="aspect-square h-full w-full rounded-xl object-cover"
        ></img>
      </div>
      <div className="flex grow flex-col justify-center gap-2 truncate px-4">
        <p className="truncate font-semibold">{name}</p>
        <p className="truncate text-sm">{creator}</p>
      </div>
      <DropdownMenu className="max-h-10 sm:hidden sm:group-hover:flex">
        <li className="bg-transparent">
          <div className="flex gap-2 rounded-xl">
            <ShuffleSVG />
            <a>{t("operations.shuffle")}</a>
          </div>
        </li>
        <li className="bg-transparent">
          <div className="flex gap-2 rounded-xl">
            <CopySVG />
            <a>{t("operations.copy")}</a>
          </div>
        </li>
        <li className="bg-transparent">
          <div className="flex gap-2 rounded-xl">
            <MergeSVG />
            <a>{t("operations.merge")}</a>
          </div>
        </li>
        <li className="bg-transparent">
          <div className="flex gap-2 rounded-xl">
            <DeleteSVG />
            <a>{t("operations.delete")}</a>
          </div>
        </li>
        <li className="bg-transparent">
          <div className="flex gap-2 rounded-xl">
            <PencilSVG />
            <a>{t("operations.rename")}</a>
          </div>
        </li>
      </DropdownMenu>
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
        "common"
      ])),
    },
  };
};