import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useStore } from "~/core/store";
import type { Playlist } from "~/types/spotify-types";
import { api } from "~/utils/api";
import BaseModal, { type BaseModalProps } from "./BaseModal";

type Props = {
  onSuccess: () => void;
  origin: Playlist;
  playlists: Playlist[];
  setIsOpen: (open: boolean) => void;
} & BaseModalProps;

export const MergeModal = ({onClose, onSuccess, origin, playlists, setIsOpen, isOpen}: Props) => {
  const { t } = useTranslation("playlists");
  const [isLoading, setIsLoading] = useState(false);
  const { setMessage } = useStore();

  const { mutate: merge } = api.spotify_playlist.merge.useMutation({
    onMutate() {
      setIsLoading(true);
    },
    onSuccess(data, variables, context) {
      setIsOpen(false);
      setMessage(`${variables.originName} ${t("operations.merged")} ${variables.destinationName}` );
      onSuccess();
    },
    onError(error) {
      setMessage(error.message);
    },
  });
  
  
  return (
    <BaseModal
      onClose={onClose}
      isOpen={isOpen}
      title={t("operations.merge_destination")}
    >
      <div>
        {playlists.map((destination) => (
          <button
            tabIndex={-1}
            className="btn my-1 w-full border-none bg-slate-400 p-2 text-black hover:bg-slate-500"
            key={destination.id}
            onClick={() =>
              merge({
                originId: origin.id,
                originName: origin.name,
                destinationId: destination.id,
                destinationName: destination.name,
              })
            }
          >
            {destination.name}
          </button>
        ))}
      </div>
    </BaseModal>
  );
};
