import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import {
  forwardRef,
  useContext,
  useMemo,
  useState,
  type ForwardedRef,
} from "react";
import { TagModal } from "~/components/modals/EditTagModal";
import { UserDataContext } from "~/context/user-data-context";
import { useToast } from "~/hooks/use-toast";
import { type Track } from "~/types/spotify-types";
import { api } from "~/utils/api";
import VirtualScroll from "./VirtualScroll";
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
  const [ openModal, setOpenModal] = useState(false);
  const { setMessage } = useToast();
  const { playlists } = useContext(UserDataContext);
  const { data: session } = useSession();

  const filteredPlaylists = useMemo(
    () => playlists?.filter((t) => t.owner?.id === session?.user?.id),
    [playlists, session]
  ); 

  const { mutate: playTrack } = api.player.togglePlayPause.useMutation();
  const { mutate: addToQueue } = api.player.addToQueue.useMutation({
    onSuccess() {
      setMessage(t("added_to_queue"));
    },
  });
  const { mutate: addToPlaylist } = api.spotify_playlist.addToPlaylist.useMutation({
    onSuccess(data, variables) {
      const msg = `${name} ${t("added_to")} ${variables.playlistName}`;
      setMessage(msg);
    },
  });

  return (
    <div
      className="group flex rounded-xl px-3 text-accent-content hover:cursor-pointer hover:bg-neutral"
      ref={ref}
    >
      <div className="flex grow items-center justify-between p-2 hover:text-primary-content">
        <div
          className="flex grow flex-col gap-1"
          onClick={() => {
            {if(uri)playTrack({
              uris: [uri],
            })}
          }}
        >
          <p className="font-medium ">{name}</p>
          <p className="text-sm font-medium text-base-content">
            {artists?.map((artist) => artist.name).join(", ")}
          </p>
        </div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button>
              <VerticalDotsSVG />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="max-w-[70vw] rounded-md border border-base-300 bg-base-100 p-2 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade sm:w-auto"
              sideOffset={-145}
            >
              <DropdownMenu.Item
                className="flex items-center gap-2 rounded-lg p-2 leading-none outline-none hover:cursor-pointer hover:bg-base-100"
                onClick={() => setOpenModal(true)}
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
                    className="w-56 max-w-[65vw] rounded-md border border-base-300 bg-base-100 p-1 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                    sideOffset={-100}
                    alignOffset={25}
                  >
                    {filteredPlaylists && (
                      <VirtualScroll
                        height="400px"
                        data={filteredPlaylists}
                        row={(virtualItem) => (
                          <DropdownMenu.Item
                            key={virtualItem.key}
                            className=" rounded-lg first:mt-2 last:mb-2 hover:cursor-pointer hover:bg-base-100"
                            onClick={() => {
                              // prettier-ignore
                              const current = filteredPlaylists[virtualItem.index];
                              if (current)
                                addToPlaylist({
                                  uri: uri,
                                  playlistId: current.id,
                                  playlistName: current.name,
                                });
                            }}
                          >
                            <p className="break-normal p-2 active:border-none">
                              {filteredPlaylists &&
                                filteredPlaylists[virtualItem.index]?.name}
                            </p>
                          </DropdownMenu.Item>
                        )}
                      />
                    )}
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
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
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
