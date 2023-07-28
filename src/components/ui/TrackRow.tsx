import { useIntersection } from "@mantine/hooks";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ForwardedRef,
} from "react";
import { TagModal } from "~/components/modals/EditTagModal";
import { usePlaylistStore } from "~/core/userStore";
import { useToast } from "~/hooks/use-toast";
import { type Track } from "~/types/spotify-types";
import { api } from "~/utils/api";
import { ArrowSVG, QueueSVG, TagSVG, VerticalDotsSVG } from "./icons";
import { FolderPlusSVG } from "./icons/FolderPlusSVG";

export interface TrackProps {
  track: Track;
  ref?: ForwardedRef<HTMLDivElement>;
}

// prettier-ignore
const TrackRow = forwardRef<HTMLDivElement, TrackProps>(({ track }, ref) => {
  const { t } = useTranslation("common");
  const { uri, name, artists, id } = track;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setMessage } = useToast();
  const { playlists } = usePlaylistStore();

  const { mutate: playTrack } = api.player.togglePlayPause.useMutation();
  const { mutate: addToQueue } = api.player.addToQueue.useMutation({
    onSuccess() {
      const msg = `${name} ${t("added_to_queue")}`;
      setMessage(msg);
    },
  });
  const { mutate: addToPlaylist } = api.spotify_playlist.addToPlaylist.useMutation({
    onSuccess(data, variables) {
      const msg = `${name} ${t("added_to")} ${variables.playlistName}`;
      setMessage(msg);
    },
  });

  const { data: session } = useSession();

  // INFINITE SCROLLING
  const { data: _data, fetchNextPage } = useInfiniteQuery(
    ["query"],
    ({ pageParam = 1 }) => {
      return playlists?.slice((pageParam - 1) * 4, pageParam * 4);
    },
    {
      enabled: playlists !== undefined,
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: {
        pages: [playlists?.slice(0, 4)],
        pageParams: [1],
      },
    }
  );

  const paginatedData = useMemo(() =>
      _data?.pages
        .flatMap((page) => page)
        .filter((t) => t?.owner?.id === session?.user?.id ?? ""),
    [session, _data]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const { ref: _ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  return (
    <div
      className="group flex rounded-xl px-3 text-accent-content hover:cursor-pointer hover:bg-neutral"
      ref={ref}
    >
      <div className="flex grow items-center justify-between p-2 hover:text-primary-content">
        <div
          className="flex grow flex-col gap-1"
          onClick={() => {
            playTrack({
              uris: [uri],
            });
          }}
        >
          <p className="font-medium ">{name}</p>
          <p className="text-sm font-medium text-base-content">
            {artists?.map((artist) => artist.name).join(", ")}
          </p>
        </div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button aria-label="Customise options">
              <VerticalDotsSVG />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="max-w-[70vw] rounded-md border border-base-300 bg-base-200 p-2 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade sm:w-auto"
              sideOffset={-145}
            >
              <DropdownMenu.Item
                className="flex items-center gap-2 rounded-lg p-2 leading-none outline-none hover:cursor-pointer hover:bg-base-100"
                onClick={() => setIsModalOpen(true)}
              >
                <TagSVG />
                {t("edit_tag")}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center gap-2 rounded-lg p-2 leading-none outline-none  hover:cursor-pointer hover:bg-base-100"
                onClick={() =>
                  addToQueue({
                    uri: uri,
                  })
                }
              >
                <QueueSVG />
                {t("add_to_queue")}
              </DropdownMenu.Item>
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger className="group relative flex select-none items-center rounded-md p-2 leading-none outline-none hover:cursor-pointer data-[state=open]:bg-base-100">
                  <div className="flex items-center gap-2">
                    <FolderPlusSVG />
                    {t("add_to_playlist")}
                  </div>
                  <div className="group-data-[disabled]:text-mauve ml-auto pl-[20px]">
                    <ArrowSVG className="-rotate-90" />
                  </div>
                </DropdownMenu.SubTrigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.SubContent
                    className="max-h-52 max-w-[65vw] overflow-auto rounded-md border border-base-300 bg-base-200 p-1 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade sm:max-h-96"
                    sideOffset={-100}
                    alignOffset={25}
                  >
                    {paginatedData?.map((destination, i) => (
                      <>
                        {destination && (
                          <DropdownMenu.Item
                            ref={i === paginatedData.length - 1 ? _ref : null}
                            key={destination.id}
                            className=" rounded-lg first:mt-2 last:mb-2 hover:cursor-pointer hover:bg-base-100"
                            onClick={() => {
                              if (destination?.id)
                                addToPlaylist({
                                  uri: uri,
                                  playlistId: destination?.id,
                                  playlistName: destination?.name,
                                });
                            }}
                          >
                            <p className="break-normal p-2 active:border-none">
                              {destination.name}
                            </p>
                          </DropdownMenu.Item>
                        )}
                      </>
                    ))}
                  </DropdownMenu.SubContent>
                </DropdownMenu.Portal>
              </DropdownMenu.Sub>
              <DropdownMenu.Sub></DropdownMenu.Sub>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      {id && (
        <TagModal
          key={id}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          trackId={id}
          tagType="track"
        />
      )}
    </div>
  );
}
);
TrackRow.displayName = "TrackRow";

export default TrackRow;
