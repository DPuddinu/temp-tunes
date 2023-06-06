import { Disclosure, Transition } from "@headlessui/react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Table,
} from "@tanstack/react-table";
import type { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { Suspense, useMemo, useRef, useState } from "react";
import MainLayout from "~/components/MainLayout";
import { UnfollowModal } from "~/components/modals/UnfollowModal";
import { DropdownMenu } from "~/components/ui/DropdownMenu";
import { CopySVG } from "~/components/ui/icons/CopySVG";
import { DeleteSVG } from "~/components/ui/icons/DeleteSVG";
import { MergeSVG } from "~/components/ui/icons/MergeSVG";
import { PencilSVG } from "~/components/ui/icons/PencilSVG";
import { ShuffleSVG } from "~/components/ui/icons/ShuffleSVG";
import { LoadingSpinner } from "~/components/ui/LoadingSpinner";
import { PlaylistPageSkeleton } from "~/components/ui/skeletons/PlaylistPageSkeleton";
import { SquareSkeleton } from "~/components/ui/skeletons/SquareSkeleton";
import { useStore } from "~/core/store";
import useMediaQuery from "~/hooks/use-media-query";
import { type PageWithLayout } from "~/types/page-types";
import { type Playlist } from "~/types/spotify-types";
import { api } from "~/utils/api";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const PlaylistsPage: PageWithLayout = () => {
  const { data, isLoading, isError } =
    api.spotify_playlist.getAll.useQuery(undefined, {
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
    <div className="flex h-full w-full flex-col items-center ">
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
  const xxs = useMediaQuery("(max-width: 425px)");
  
  const {data: session} = useSession()
  const {
    isError,
    mutate: shuffle,
  } = api.spotify_playlist.shuffle.useMutation({
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
  } = api.spotify_playlist.copy.useMutation({
    onMutate(){
      setIsLoading(true)
    },
    onSuccess() {
      setMessage(`${playlist.name} ${t("operations.copied")}`);
      setIsLoading(false)
      setTimeout(() => {
        window.dispatchEvent(new Event("focus"))
      },300)
    }
  });
  const {
    mutate: merge,
    isError: mergeError,
  } = api.spotify_playlist.merge.useMutation({
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

  return (
    <div
      ref={ref}
      className="group flex max-h-20 items-center rounded-2xl border-base-300 bg-base-200 shadow "
    >
      <div className="h-20 w-20 min-w-[5rem]">
        <Suspense fallback={<SquareSkeleton />}>
          <Image
            src={
              playlist.images && playlist.images[0]
                ? playlist.images[0].url
                : ""
            }
            alt=""
            quality={10}
            priority={true}
            height={80}
            width={80}
            className="aspect-square h-full w-full rounded-xl object-cover"
          />
        </Suspense>
      </div>
      <div className="flex grow flex-col justify-center gap-2 truncate px-4">
        <p className="truncate font-semibold">{playlist.name}</p>
        <p className="truncate text-sm">{playlist.owner.display_name}</p>
      </div>
      {isLoading ? (
        <LoadingSpinner className="mr-4" />
      ) : (
        <DropdownMenu intent={"darkest"}>
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
            <li>
              <details>
                <summary>
                  <MergeSVG />
                  <span>{t("operations.merge")}</span>
                </summary>
                <ul className="px-0 pt-2 m-2 max-h-40 w-[11rem] overflow-auto rounded-xl bg-base-200 bg-opacity-80 before:hidden">
                  {data
                    .filter((t) => t.owner.id === session?.user?.id ?? "")
                    .map((destination) => (
                      <li
                        key={destination.id}
                        className="px-3 py-1 hover:cursor-pointer z-20"
                        onClick={() =>
                          merge({
                            originId: playlist.id,
                            originName: playlist.name,
                            destinationName: destination.name,
                            destinationId: destination.id,
                          })
                        }
                      >
                        <p className="p-2">{destination.name}</p>
                      </li>
                    ))}
                </ul>
              </details>
            </li>
            {/* <li className="group/merge relative flex gap-2 rounded-xl hover:bg-base-100">
                <button
                  className="flex grow gap-2 rounded-xl"
                  onClick={() => setOpenMergeModal((open) => !open)}
                >
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
                {!xxs && (
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
                      .map((destination) => (
                        <li
                          key={self.crypto.randomUUID()}
                          className="relative bg-base-300 px-3 py-1 first:rounded-t-xl last:rounded-b-xl hover:cursor-pointer hover:bg-primary"
                          onClick={() =>
                            merge({
                              originId: playlist.id,
                              originName: playlist.name,
                              destinationName: destination.name,
                              destinationId: destination.id,
                            })
                          }
                        >
                          {destination.name}
                        </li>
                      ))}
                  </ul>
                )}
              </li> */}
            {/* <li>
                <details open>
                  <summary>Parent</summary>
                  <ul>
                    <li>
                      <a>level 2 item 1</a>
                    </li>
                    <li>
                      <a>level 2 item 2</a>
                    </li>
                  </ul>
                </details>
              </li> */}

            {/* DELETE */}
            <li onClick={() => setOpenUnfollowModal(true)}>
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
      )}
      <UnfollowModal
        isOpen={openUnfollowModal}
        setIsOpen={setOpenUnfollowModal}
        playlistID={playlist.id}
        playlistName={playlist.name}
        onClose={() => setOpenUnfollowModal(false)}
        onSuccess={() => {
          setIsLoading(false);
          setTimeout(() => {
            window.dispatchEvent(new Event("focus"));
          }, 300);
        }}
        onConfirm={() => setIsLoading(true)}
      />
    </div>
  );
}

export default PlaylistsPage;

PlaylistsPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export const getStaticProps: GetStaticProps = async (context) => {
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


