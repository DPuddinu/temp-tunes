import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ForwardedRef
} from "react";
import { TagModal } from "~/components/modals/EditTagModal";
import { usePlaylistStore } from "~/core/userStore";
import { useToast } from "~/hooks/use-toast";
import { type Track } from "~/types/spotify-types";
import { api } from "~/utils/api";
import DropdownMenu from "./DropdownMenu";

export interface TrackProps {
  track: Track;
  index?: number;
  options?: TrackDropdownOptions[];
  ref?: ForwardedRef<HTMLDivElement>;
}

export type TrackDropdownOptions = "ADD_TO_QUEUE" | "EDIT_TAGS";

// prettier-ignore
const TrackRow = forwardRef<HTMLDivElement, TrackProps>(({ track, index = 0 }, ref) => {
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
    onSuccess(data, variables, context) {
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
          }
            
          }
        >
          <p className="font-medium ">{name}</p>
          <p className="text-sm font-medium text-base-content">
            {artists?.map((artist) => artist.name).join(", ")}
          </p>
        </div>
        <DropdownMenu intent={"light"} direction={index > 2 ? "up" : "down"}>
          <li className="bg-transparent" onClick={() => setIsModalOpen(true)}>
            <div className={"rounded-xl"}>
              <a>{t("edit_tag")}</a>
            </div>
          </li>
          <li
            className="bg-transparent"
            onClick={() =>
              addToQueue({
                uri: uri,
              })
            }
          >
            <div className={"rounded-xl"}>
              <a>{t("add_to_queue")}</a>
            </div>
          </li>
          <li>
            <details>
              <summary>
                <span>{t("add_to_playlist")}</span>
              </summary>
              <ul className="m-2 max-h-40 w-[11rem] overflow-auto rounded-xl bg-base-200 bg-opacity-80 px-0 pt-2 before:hidden">
                {paginatedData?.map((destination, i) => (
                  <li
                    ref={i === paginatedData.length - 1 ? _ref : null}
                    key={destination?.id}
                    className="z-20 px-3 py-1 hover:cursor-pointer"
                    onClick={() => {
                      if(destination?.id)
                      addToPlaylist({
                        uri: uri,
                        playlistId: destination?.id,
                        playlistName: destination?.name
                      })
                    }}
                  >
                    <p className="p-2">{destination?.name}</p>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        </DropdownMenu>
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
