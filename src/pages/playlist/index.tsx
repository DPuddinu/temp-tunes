import { Disclosure, Transition } from "@headlessui/react";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import MainLayout from "~/components/MainLayout";
import { DropdownMenu } from "~/components/ui/DropdownMenu";
import { CopySVG } from "~/components/ui/icons/CopySVG";
import { DeleteSVG } from "~/components/ui/icons/DeleteSVG";
import { MergeSVG } from "~/components/ui/icons/MergeSVG";
import { PencilSVG } from "~/components/ui/icons/PencilSVG";
import { ShuffleSVG } from "~/components/ui/icons/ShuffleSVG";
import { LoadingSpinner } from "~/components/ui/LoadingSpinner";
import { PlaylistPageSkeleton } from "~/components/ui/skeletons/Skeleton";
import { usePlaylistStore, useStore } from "~/core/store";
import { PageWithLayout } from "~/types/page-types";
import { Playlist } from "~/types/spotify-types";
import { api } from "~/utils/api";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const PlaylistsPage: PageWithLayout = () => {
  const { playlists } = usePlaylistStore();
  const { data, isLoading, isError } =
    api.spotify_playlist.getAllPlaylists.useQuery(undefined, {
      refetchOnWindowFocus: false,
      enabled: !playlists,
    });
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

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {isLoading ? (
        <PlaylistPageSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={playlists ? playlists : data ? data : []}
        />
      )}
    </div>
  );
};

function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
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
      <TableBodyComponent table={table} />
      <PaginationComponent table={table} />
    </>
  );
}

function FiltersComponent<TData>({ table }: { table: Table<TData> }) {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
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
                    (table.getColumn("name")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
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
                    (table.getColumn("creator")?.getFilterValue() as string) ??
                    ""
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
  );
}
function TableBodyComponent<TData>({ table }: { table: Table<TData> }) {
  return (
    <div className="flex w-full flex-col gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:w-3/4">
      {table.getRowModel().rows?.length ? (
        table
          .getRowModel()
          .rows.map((row) => (
            <PlaylistComponent
              key={row.id}
              playlist={row.original as Playlist}
            />
          ))
      ) : (
        <div>No results</div>
      )}
    </div>
  );
}
function PaginationComponent<TData>({ table }: { table: Table<TData> }) {
  return (
    <div className="btn-group mt-3 flex justify-center lg:w-3/4">
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
  );
}
function PlaylistComponent({ playlist }: { playlist: Playlist }) {
  const { t } = useTranslation("playlists");
  const router = useRouter();
  const {
    isError,
    isLoading,
    mutate: shuffle,
  } = api.spotify_playlist.randomizePlaylist.useMutation({
    onSuccess() {
      setMessage(`${playlist.name} ${t("operations.shuffled")}`);
    },
  });
  const {
    mutate: copy,
    isLoading: copyLoading,
    isError: copyError,
  } = api.spotify_playlist.copyPlaylist.useMutation({
    onSuccess() {
      setMessage(`${playlist.name} ${t("operations.copied")}`);
    },
  });
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { setMessage } = useStore();

  const [position, setPosition] = useState("");

  useEffect(() => {
    if (
      ref.current &&
      listRef.current &&
      window.innerHeight - ref.current.getBoundingClientRect().bottom <
        listRef.current.offsetHeight
    ) {
      setPosition("dropdown-top");
    } else setPosition("dropdown-bottom");
  }, [ref, listRef]);

  return (
    <div
      ref={ref}
      className="group flex max-h-20 items-center rounded-2xl border-base-300 bg-base-200 shadow "
    >
      <div className="h-20 w-20 min-w-[5rem]">
        <img
          src={
            playlist.images && playlist.images[0] ? playlist.images[0].url : ""
          }
          className="aspect-square h-full w-full rounded-xl object-cover"
        ></img>
      </div>
      <div className="flex grow flex-col justify-center gap-2 truncate px-4">
        <p className="truncate font-semibold">{playlist.name}</p>
        <p className="truncate text-sm">{playlist.owner.display_name}</p>
      </div>
      {isLoading ? (
        <LoadingSpinner/>
      ) : (
        <DropdownMenu
          intent={"darkest"}
          className={`max-h-10 pr-4 ${position}`}
        >
          <div ref={listRef}>
            <li
              onClick={() => {
                shuffle({ playlist: playlist });
              }}
            >
              <div className="flex gap-2 rounded-xl">
                <ShuffleSVG />
                <a>{t("operations.shuffle")}</a>
              </div>
            </li>
            <li
              onClick={() => {
                copy({ playlist: playlist });
                router.reload();
              }}
            >
              <div className="flex gap-2 rounded-xl">
                <CopySVG />
                <a>{t("operations.copy")}</a>
              </div>
            </li>
            <li className="disabled bg-transparent">
              <div className="flex gap-2 rounded-xl">
                <MergeSVG />
                <a>{t("operations.merge")}</a>
              </div>
            </li>
            <li className="disabled bg-transparent">
              <div className="flex gap-2 rounded-xl">
                <DeleteSVG />
                <a>{t("operations.delete")}</a>
              </div>
            </li>
            <li className="disabled bg-transparent">
              <div className="flex gap-2 rounded-xl">
                <PencilSVG />
                <a>{t("operations.rename")}</a>
              </div>
            </li>
          </div>
        </DropdownMenu>
      )}
    </div>
  );
}

export default PlaylistsPage;

PlaylistsPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      //prettier- ignore
      ...(await serverSideTranslations(context.locale ?? "en", [
        "playlists",
        "common",
      ])),
    },
  };
};
