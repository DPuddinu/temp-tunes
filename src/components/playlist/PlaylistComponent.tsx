import { useIntersection } from "@mantine/hooks";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { RenameModal } from "~/components/modals/RenamePlaylistModal";
import { UnfollowModal } from "~/components/modals/UnfollowPlaylistModal";
import { LoadingSpinner } from "~/components/ui/LoadingSpinner";
import {
  ArrowSVG,
  CopySVG,
  DeleteSVG,
  ErrorSVG,
  MergeSVG,
  PencilSVG,
  ShuffleSVG,
  VerticalDotsSVG,
} from "~/components/ui/icons";
import { useToast } from "~/hooks/use-toast";
import type { Playlist } from "~/types/spotify-types";
import { api } from "~/utils/api";
import { ImageWithFallback } from "../ui/ImageWithFallback";

function PlaylistComponent({
  playlist,
  data,
}: {
  playlist: Playlist;
  data: Playlist[];
}) {
  const { t } = useTranslation("playlists");
  const [isLoading, setIsLoading] = useState(false);
  const { setMessage } = useToast();

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
    <div className="group flex max-h-16 items-center rounded-2xl border-base-300 bg-base-200 pr-3 shadow">
      <div className="h-16 w-16">
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
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button aria-label="Customise options">
              <VerticalDotsSVG />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="max-w-[50vw] rounded-md border-base-200 bg-base-300 p-2 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
              sideOffset={5}
            >
              <DropdownMenu.Item
                className="flex items-center gap-2 p-2 leading-none outline-none hover:cursor-pointer"
                onClick={() => {
                  shuffle({ playlist: playlist });
                }}
              >
                <ShuffleSVG />
                {t("operations.shuffle")}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center gap-2 p-2 leading-none outline-none hover:cursor-pointer"
                onClick={() => {
                  copy({ playlist: playlist });
                }}
              >
                <CopySVG />
                {t("operations.copy")}
              </DropdownMenu.Item>
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger className="group relative flex select-none items-center rounded-md p-2 leading-none outline-none hover:cursor-pointer data-[state=open]:bg-base-200">
                  <div className="flex items-center gap-2">
                    <MergeSVG />
                    {t("operations.merge")}
                  </div>
                  <div className="ml-auto pl-[20px]">
                    <ArrowSVG className="-rotate-90" />
                  </div>
                </DropdownMenu.SubTrigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.SubContent
                    className="max-h-60 max-w-[50vw] overflow-auto rounded-md border-base-300 bg-base-300 p-1 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade sm:max-h-96"
                    sideOffset={8}
                    alignOffset={-5}
                  >
                    {paginatedData?.map((destination, i) => (
                      <>
                        <DropdownMenu.Item
                          ref={i === paginatedData.length - 1 ? ref : null}
                          key={destination.id}
                          className=" rounded-lg first:mt-2 last:mb-2 hover:cursor-pointer hover:border-none hover:bg-base-200"
                          onClick={() =>
                            merge({
                              originId: playlist.id,
                              originName: playlist.name,
                              destinationName: destination.name,
                              destinationId: destination.id,
                            })
                          }
                        >
                          <p className="break-normal p-2 active:border-none">
                            {destination.name}
                          </p>
                        </DropdownMenu.Item>
                      </>
                    ))}
                  </DropdownMenu.SubContent>
                </DropdownMenu.Portal>
              </DropdownMenu.Sub>
              <DropdownMenu.Item
                className="flex items-center gap-2 p-2 leading-none outline-none hover:cursor-pointer"
                onClick={() => setUnfollowModalOpen(true)}
              >
                <DeleteSVG />
                {t("operations.unfollow")}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center gap-2 p-2 leading-none outline-none hover:cursor-pointer"
                onClick={() => setRenameModalOpen(true)}
              >
                <PencilSVG />
                {t("operations.rename")}
              </DropdownMenu.Item>
              <DropdownMenu.Sub></DropdownMenu.Sub>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
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
