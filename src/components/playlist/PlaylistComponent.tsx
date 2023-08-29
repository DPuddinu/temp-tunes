import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { UnfollowModal } from "~/components/modals/RemovePlaylistModal";
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
import { RenameModal } from "../modals/RenamePlaylistModal";
import { ImageWithFallback } from "../ui/ImageWithFallback";
import VirtualScroll from "../ui/VirtualScroll";

const LoadingSpinner = dynamic(() => import("~/components/ui/LoadingSpinner"));

type selectedModal = 'rename' | 'unfollow' | null;

function PlaylistComponent({
  playlist,
  data,
}: {
  playlist: Playlist;
  data: Playlist[];
}) {
  const { t } = useTranslation("playlists");
  const { t: t_common } = useTranslation("common");

  const [isLoading, setIsLoading] = useState(false);
  const { setMessage } = useToast();
  const utils = api.useContext().spotify_playlist.getAll;

  const [openModal, setOpenModal] = useState<selectedModal>(null);

  const { data: session } = useSession();

  const filteredPlaylists = useMemo(
    () => data.filter((t) => t.owner?.id === session?.user?.id ?? ""),
    [data, session]
  );

  const { mutate: shuffle } = api.spotify_playlist.shuffle.useMutation({
    onMutate() {
      setIsLoading(true);
    },
    onSuccess() {
      setMessage(`${playlist.name} ${t("operations.shuffled")}`);
      setIsLoading(false);
    },
    onError() {
      setMessage(t_common("error"));
    },
  });
  const { mutate: copy } = api.spotify_playlist.copy.useMutation({
    onSuccess() {
      setMessage(`${playlist.name} ${t("operations.copied")}`);
      utils.invalidate()
      setIsLoading(false);
    },
    onError() {
      setMessage(t_common("error"));
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
    onError() {
      setMessage(t_common("error"));
    },
  });

  return (
    <div className="group flex max-h-16 items-center rounded-2xl bg-base-200 pr-3 shadow">
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
              className="min-w-[10.5rem] max-w-[50vw] rounded-md border border-base-300 bg-base-100 p-2 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
              sideOffset={5}
            >
              {playlist.owner.id === session?.user?.id && (
                <DropdownMenu.Item
                  className="flex items-center gap-2 rounded-lg p-2 leading-none outline-none hover:cursor-pointer hover:bg-base-200"
                  onClick={() => {
                    shuffle({ playlist: playlist });
                  }}
                >
                  <ShuffleSVG />
                  {t("operations.shuffle")}
                </DropdownMenu.Item>
              )}
              <DropdownMenu.Item
                className="flex items-center gap-2 rounded-lg p-2 leading-none outline-none hover:cursor-pointer hover:bg-base-200"
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
                    className="w-56 max-w-[65vw] overflow-auto rounded-md border border-base-300 bg-base-100 p-1 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                    sideOffset={-100}
                    alignOffset={25}
                  >
                    {filteredPlaylists && (
                      <VirtualScroll
                        height="400px"
                        data={filteredPlaylists}
                        row={(virtualItem) => (
                          <DropdownMenu.Item
                            className=" rounded-lg first:mt-2 last:mb-2 hover:cursor-pointer hover:rounded-lg hover:border-none hover:bg-base-200"
                            onClick={() => {
                              // prettier-ignore
                              const current = filteredPlaylists[virtualItem.index];
                              if (filteredPlaylists && current)
                                merge({
                                  originId: playlist.id,
                                  originName: playlist.name,
                                  destinationName: current.name,
                                  destinationId: current.id,
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
              <DropdownMenu.Item
                className="flex items-center gap-2 p-2 leading-none outline-none hover:cursor-pointer hover:rounded-lg hover:bg-base-200"
                onClick={() => setOpenModal("unfollow")}
              >
                <DeleteSVG />
                {t("operations.remove")}
              </DropdownMenu.Item>
              {playlist.owner.id === session?.user?.id && (
                <DropdownMenu.Item
                  className="flex items-center gap-2 p-2 leading-none outline-none hover:cursor-pointer hover:rounded-lg hover:bg-base-200"
                  onClick={() => setOpenModal("rename")}
                >
                  <PencilSVG />
                  {t("operations.rename")}
                </DropdownMenu.Item>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
      <UnfollowModal
        isOpen={openModal === "unfollow"}
        playlistID={playlist.id}
        playlistName={playlist.name}
        onClose={() => setOpenModal(null)}
        onConfirm={() => setIsLoading(true)}
      />
      <RenameModal
        isOpen={openModal === "rename"}
        playlistID={playlist.id}
        playlistName={playlist.name}
        onClose={() => setOpenModal(null)}
        onConfirm={() => setIsLoading(true)}
      />
    </div>
  );
}
export default PlaylistComponent;
