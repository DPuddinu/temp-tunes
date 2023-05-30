import { useTranslation } from "next-i18next";
import { api } from "~/utils/api";
import { ConfirmButtonGroup } from "../ui/ConfirmationButtonGroup";
import type { BaseModalProps } from "./BaseModal";
import BaseModal from "./BaseModal";

type Props = {
  setIsOpen: (open: boolean) => void;
  playlistID: string
} & BaseModalProps;

export function UnfollowModal({
  isOpen,
  onClose,
  setIsOpen,
  playlistID,
}: Props) {
  const { t } = useTranslation("playlists");

  const { mutate } = api.spotify_playlist.unfollowPlaylist.useMutation({
    onSuccess(){
      setIsOpen(false)
    }
  });

  return (
    <BaseModal isOpen={isOpen} title={t("confirmation")}>
      <div className="h-3/4 flex flex-col p-4 justify-between">
        <div className="text-xl">{t("operations.confirm_unfollow")}</div>
        <ConfirmButtonGroup
          onConfirm={() => mutate({ playlistID: playlistID })}
          onClose={onClose}
        />
      </div>
    </BaseModal>
  );
}

