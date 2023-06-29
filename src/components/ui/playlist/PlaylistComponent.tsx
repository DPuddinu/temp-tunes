import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { RenameModal } from "~/components/modals/RemaneModal";
import { UnfollowModal } from "~/components/modals/UnfollowModal";
import { DropdownMenu } from "~/components/ui/DropdownMenu";
import { LoadingSpinner } from "~/components/ui/LoadingSpinner";
import {
  CopySVG,
  DeleteSVG,
  ErrorSVG,
  MergeSVG,
  PencilSVG,
  ShuffleSVG,
} from "~/components/ui/icons";
import { useStore } from "~/core/store";
import type { Playlist } from "~/types/spotify-types";
import { api } from "~/utils/api";
import { ImageWithFallback } from "../ImageWithFallback";

function PlaylistComponent({
  playlist,
  data,
}: {
  playlist: Playlist;
  data: Playlist[];
}) {
  const { t } = useTranslation("playlists");
  const [isLoading, setIsLoading] = useState(false);
  const { setMessage } = useStore();
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [unfollowModalOpen, setUnfollowModalOpen] = useState(false);

  const { data: session } = useSession();

  // INFINITE SCROLLING
  const { data: _data, fetchNextPage } = useInfiniteQuery(
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

  const paginatedData = useMemo(
    () =>
      _data?.pages
        .flatMap((page) => page)
        .filter((t) => t.owner?.id === session?.user?.id ?? ""),
    [session, _data]
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const { mutate: shuffle } = api.spotify_playlist.shuffle.useMutation({
    onMutate() {
      setIsLoading(true);
    },
    onSuccess() {
      setMessage(`${playlist.name} ${t("operations.shuffled")}`);
      setIsLoading(false);
    },
  });
  const { mutate: copy } = api.spotify_playlist.copy.useMutation({
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
  const { mutate: merge } = api.spotify_playlist.merge.useMutation({
    onMutate() {
      setIsLoading(true);
    },
    onSuccess() {
      setMessage(`${playlist.name} ${t("operations.merge")}`);
      setIsLoading(false);
    },
  });

  return (
    <div className="group flex max-h-20 items-center rounded-2xl border-base-300 bg-base-200 pr-3 shadow">
      <div className="h-20 w-20 min-w-[5rem]">
        <ImageWithFallback
          src={
            playlist.images && playlist.images[0] ? playlist.images[0].url : ""
          }
          fallback={
            <div className="flex aspect-square h-full w-full items-center justify-center rounded-xl bg-base-200 bg-opacity-50">
              <ErrorSVG />
            </div>
          }
          quality={60}
          height={80}
          width={80}
          className="aspect-square h-full w-full rounded-xl bg-base-100 object-cover"
        />
      </div>
      <Link
        href={`/playlist/${playlist.id}`}
        className="flex grow flex-col justify-center gap-2 truncate px-4"
      >
        <div>
          <p className="truncate font-semibold">{playlist.name}</p>
          <p className="truncate text-sm">{playlist.owner.display_name}</p>
        </div>
      </Link>
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
                <ul className="m-2 max-h-40 w-[11rem] overflow-auto rounded-xl bg-base-200 bg-opacity-80 px-0 pt-2 before:hidden">
                  {paginatedData?.map((destination, i) => (
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
            <li onClick={() => setUnfollowModalOpen(true)}>
              <div className="flex gap-2 rounded-xl">
                <DeleteSVG />
                <a>{t("operations.unfollow")}</a>
              </div>
            </li>
            {/* RENAME */}
            <li onClick={() => setRenameModalOpen(true)}>
              <div className="flex gap-2 rounded-xl">
                <PencilSVG />
                <a>{t("operations.rename")}</a>
              </div>
            </li>
          </div>
        </DropdownMenu>
      )}
      <UnfollowModal
        isOpen={unfollowModalOpen}
        setIsOpen={setUnfollowModalOpen}
        playlistID={playlist.id}
        playlistName={playlist.name}
        onClose={() => setUnfollowModalOpen(false)}
        onSuccess={() => {
          setIsLoading(false);
          setTimeout(() => {
            window.dispatchEvent(new Event("focus"));
          }, 300);
        }}
        onConfirm={() => setIsLoading(true)}
      />
      <RenameModal
        isOpen={renameModalOpen}
        setIsOpen={setRenameModalOpen}
        playlistID={playlist.id}
        playlistName={playlist.name}
        onClose={() => setRenameModalOpen(false)}
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
export default PlaylistComponent;
