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
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import MainLayout from "~/components/MainLayout";
import { UnfollowModal } from "~/components/modals/UnfollowModal";
import { DropdownMenu } from "~/components/ui/DropdownMenu";
import { CopySVG } from "~/components/ui/icons/CopySVG";
import { DeleteSVG } from "~/components/ui/icons/DeleteSVG";
import { MergeSVG } from "~/components/ui/icons/MergeSVG";
import { PencilSVG } from "~/components/ui/icons/PencilSVG";
import { ShuffleSVG } from "~/components/ui/icons/ShuffleSVG";
import { LoadingSpinner } from "~/components/ui/LoadingSpinner";
import { PlaylistPageSkeleton } from "~/components/ui/skeletons/Skeleton";
import { useStore } from "~/core/store";
import { PageWithLayout } from "~/types/page-types";
import { Playlist } from "~/types/spotify-types";
import { api } from "~/utils/api";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const PlaylistsPage: PageWithLayout = () => {
  const { data, isLoading, isError } =
    api.spotify_playlist.getAllPlaylists.useQuery(undefined, {
      refetchOnWindowFocus: true,
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
          data={data ? data : []}
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
      <TableBodyComponent table={table} data={data as Playlist[]} />
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
function TableBodyComponent<TData>({ table, data }: { table: Table<TData>, data: Playlist[] }) {
  return (
    <div className="flex w-full flex-col gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:w-3/4">
      {table.getRowModel().rows?.length ? (
        table
          .getRowModel()
          .rows.map((row, i) => (
            <PlaylistComponent
              key={row.id}
              data={data}
              playlist={row.original as Playlist}
              index={i}
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

function PlaylistComponent({ playlist, data, index }: { playlist: Playlist, data: Playlist[], index: number }) {
  const { t } = useTranslation("playlists");
  const [isLoading, setIsLoading] = useState(false)
  const {data: session} = useSession()
  const {
    isError,
    mutate: shuffle,
  } = api.spotify_playlist.randomizePlaylist.useMutation({
    onMutate(){
      setIsLoading(true);
    },
    onSuccess() {
      setMessage(`${playlist.name} ${t("operations.shuffled")}`);
      setIsLoading(false)
    },
  });
  const {
    mutate: copy,
    isError: copyError,
  } = api.spotify_playlist.copyPlaylist.useMutation({
    onMutate(){
      setIsLoading(true)
    },
    onSuccess() {
      setMessage(`${playlist.name} ${t("operations.copied")}`);
      setIsLoading(false)
      window.dispatchEvent(new Event("focus")); // trigger window focus to refetch playlists
    },
  });
  const {
    mutate: merge,
    isError: mergeError,
  } = api.spotify_playlist.mergePlaylist.useMutation({
    onMutate(){
      setIsLoading(true)
    },
    onSuccess() {
      setMessage(`${playlist.name} ${t("operations.merge")}`);
      setIsLoading(false)
    },
  });
  
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { setMessage } = useStore();
  const [openUnfollowModal, setOpenUnfollowModal] = useState(false)
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
        <LoadingSpinner className="mr-4" />
      ) : (
        <MultiLevel>
          <DropdownMenu
            intent={"darkest"}
            className={`max-h-10 pr-4 ${position}`}
          >
            <div ref={listRef}>
              {/* SHUFFLE */}
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
              {/* COPY */}
              <li
                onClick={() => {
                  copy({ playlist: playlist });
                }}
              >
                <div className="flex gap-2 rounded-xl">
                  <CopySVG />
                  <a>{t("operations.copy")}</a>
                </div>
              </li>
              {/* MERGE */}
              <li className="group/merge relative flex gap-2 rounded-xl hover:bg-base-100">
                <button className="flex grow gap-2 rounded-xl">
                  <MergeSVG />
                  <a>{t("operations.merge")}</a>
                  <span className="flex grow justify-end">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 20"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="arrow h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </span>
                </button>
                <ul
                  className={`absolute top-0 right-0 hidden max-h-80 -translate-x-full translate-y-[-5rem] overflow-x-auto overflow-y-scroll rounded-xl bg-base-300 p-2 group-hover/merge:block
                ${
                  index % 2 === 0
                    ? "sm:translate-x-full"
                    : "sm:-translate-x-full"
                }
                ${
                  (index + 1) % 3 === 0
                    ? "md:-translate-x-full"
                    : "md:translate-x-full"
                }`}
                >
                  {data
                    .filter((t) => t.owner.id === session?.user?.id ?? "")
                    .map((p) => (
                      <li
                        className="relative bg-base-300 px-3 py-1 first:rounded-t-xl last:rounded-b-xl hover:cursor-pointer hover:bg-primary"
                        onClick={() =>
                          merge({
                            origin: playlist,
                            destinationId: p.id,
                          })
                        }
                      >
                        {p.name}
                      </li>
                    ))}
                </ul>
              </li>
              {/* DELETE */}
              <li
                className="disabled bg-transparent"
                onClick={() => setOpenUnfollowModal(true)}
              >
                <div className="flex gap-2 rounded-xl">
                  <DeleteSVG />
                  <a>{t("operations.unfollow")}</a>
                </div>
              </li>
              {/* RENAME */}
              <li className="disabled bg-transparent">
                <div className="flex gap-2 rounded-xl">
                  <PencilSVG />
                  <a>{t("operations.rename")}</a>
                </div>
              </li>
            </div>
          </DropdownMenu>
        </MultiLevel>
      )}
      <UnfollowModal isOpen={openUnfollowModal} playlistID={playlist.id} setIsOpen={setOpenUnfollowModal} onClose={() => setOpenUnfollowModal(false)} ></UnfollowModal>
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


const MultiLevel = styled.div`
  li > button .arrow {
    transform: rotate(-90deg);
  }
  li:hover > button .arrow {
    transform: rotate(-270deg);
  }
  .group:hover .group-hover\:scale-100 {
    transform: scale(1);
  }
  .group:hover .group-hover\:-rotate-180 {
    transform: rotate(180deg);
  }
  .scale-0 {
    transform: scale(0);
  }
`;


