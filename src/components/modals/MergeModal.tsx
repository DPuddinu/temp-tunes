import { api } from "~/utils/api";
import BaseModal, { type BaseModalProps } from "./BaseModal";
import { useEffect, useRef, useState } from "react";
import type { Playlist } from "~/types/spotify-types";
import { useStore } from "~/core/store";
import { useTranslation } from "next-i18next";

type Props = {
  onSuccess: () => void;
  origin: Playlist;
  playlists: Playlist[];
  setIsOpen: (open: boolean) => void;
} & BaseModalProps;

export const MergeModal = ({onClose, onSuccess,origin, playlists, setIsOpen, isOpen}: Props) => {
  const { t } = useTranslation("playlists");
  const [isLoading, setIsLoading] = useState(false);
  const { setMessage } = useStore();
  const ref = useRef<HTMLDivElement>(null);

  const { mutate: merge, isError: mergeError } = api.spotify_playlist.mergePlaylist.useMutation({
      onMutate() {
        setIsLoading(true);
      },
      onSuccess(data, variables, context) {
          setIsOpen(false);
          onSuccess();
      },
      
    });
  useEffect(() => {
    if(ref.current)ref.current.focus()
  },[ref])
  
  return (
    <BaseModal onClose={onClose} isOpen={isOpen} title={t("merge_destination")}>
      <div className="" ref={ref} >
        {playlists.map((playlist) => (
          <div
            className="p-2 text-black first:rounded-t-xl last:rounded-b-xl bg-slate-400"
            key={playlist.id}
            onClick={() =>
              merge({ origin: origin, destinationId: playlist.id })
            }
          >
            {playlist.name}
          </div>
        ))}
      </div>
    </BaseModal>
  );
};
