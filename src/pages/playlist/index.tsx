import { Disclosure, Transition } from "@headlessui/react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
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
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import MainLayout from "~/components/MainLayout";
import { UnfollowModal } from "~/components/modals/UnfollowModal";
import { DropdownMenu } from "~/components/ui/DropdownMenu";
import { LoadingSpinner } from "~/components/ui/LoadingSpinner";
import { CopySVG } from "~/components/ui/icons/CopySVG";
import { DeleteSVG } from "~/components/ui/icons/DeleteSVG";
import { MergeSVG } from "~/components/ui/icons/MergeSVG";
import { PencilSVG } from "~/components/ui/icons/PencilSVG";
import { ShuffleSVG } from "~/components/ui/icons/ShuffleSVG";
import { PlaylistPageSkeleton } from "~/components/ui/skeletons/PlaylistPageSkeleton";
import { SquareSkeleton } from "~/components/ui/skeletons/SquareSkeleton";
import { useStore } from "~/core/store";
import { type PageWithLayout } from "~/types/page-types";
import { type Playlist } from "~/types/spotify-types";
import { api } from "~/utils/api";
import { spliceArray } from "~/utils/helpers";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const PlaylistsPage: PageWithLayout = () => {
  const { data, isLoading, isError } = api.spotify_playlist.getAll.useQuery(
    undefined,
    {
      refetchOnWindowFocus: true,
    }
  );
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
        <DataTable columns={columns} data={data ? data : []} />
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
function TableBodyComponent<TData>({
  table,
  data,
}: {
  table: Table<TData>;
  data: Playlist[];
}) {
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

function PlaylistComponent({
  playlist,
  data,
}: {
  playlist: Playlist;
  data: Playlist[];
}) {
  const { t } = useTranslation("playlists");
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: _data,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["query"],
    ({ pageParam = 1 }) => {
      return data.slice((pageParam - 1) * 4, pageParam * 4);
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: {
        pages: [data.slice(0, 4)],
        pageParams: [1],
      },
    }
  );

  const paginatedData = _data?.pages.flatMap((page) => page);
  const lastPlaylistRef = useRef<HTMLULElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPlaylistRef.current,
    threshold: 1,
  });

  useEffect(() => {
    console.log(entry);
    console.log(ref);
    console.log();
    if (entry?.isIntersecting) fetchNextPage();
  }, [entry, fetchNextPage]);

  const { data: session } = useSession();
  const { isError, mutate: shuffle } = api.spotify_playlist.shuffle.useMutation(
    {
      onMutate() {
        setIsLoading(true);
      },
      onSuccess() {
        setMessage(`${playlist.name} ${t("operations.shuffled")}`);
        setIsLoading(false);
      },
    }
  );
  const { mutate: copy, isError: copyError } =
    api.spotify_playlist.copy.useMutation({
      onMutate() {
        setIsLoading(true);
      },
      onSuccess() {
        setMessage(`${playlist.name} ${t("operations.copied")}`);
        setIsLoading(false);
        setTimeout(() => {
          window.dispatchEvent(new Event("focus"));
        }, 300);
      },
    });
  const { mutate: merge, isError: mergeError } =
    api.spotify_playlist.merge.useMutation({
      onMutate() {
        setIsLoading(true);
      },
      onSuccess() {
        setMessage(`${playlist.name} ${t("operations.merge")}`);
        setIsLoading(false);
      },
    });

  const { setMessage } = useStore();
  const [openUnfollowModal, setOpenUnfollowModal] = useState(false);

  return (
    <div className="group flex max-h-20 items-center rounded-2xl border-base-300 bg-base-200 shadow ">
      <div className="h-20 w-20 min-w-[5rem]">
        <Suspense fallback={<SquareSkeleton />}>
          <Image
            src={
              playlist.images && playlist.images[0]
                ? playlist.images[0].url
                : ""
            }
            alt="blur"
            quality={60}
            priority
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
          <div className="flex min-h-[15rem] flex-col [&>li]:grow [&>li]:text-base">
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
                <ul
                  ref={lastPlaylistRef}
                  className="m-2 max-h-40 w-[11rem] overflow-auto rounded-xl bg-base-200 bg-opacity-80 px-0 pt-2 before:hidden"
                >
                  {paginatedData
                    ?.filter((t) => t.owner.id === session?.user?.id ?? "")
                    .map((destination, i) => (
                      <li
                        ref={i === paginatedData.length - 1 ? ref : null}
                        key={destination.id}
                        className="z-20 px-3 py-1 hover:cursor-pointer"
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
