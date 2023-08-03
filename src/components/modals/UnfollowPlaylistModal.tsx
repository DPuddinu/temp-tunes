import { useTranslation } from "next-i18next";
import { api } from "~/utils/api";
import { ConfirmButtonGroup } from "../ui/ConfirmationButtonGroup";
import type { BaseModalProps } from "./BaseModal";
import BaseModal from "./BaseModal";

type Props = {
  setIsOpen: (open: boolean) => void;
  onConfirm: () => void;
  onSuccess: () => void;
  playlistID: string;
  playlistName: string;
} & BaseModalProps;

export function UnfollowModal({
  isOpen,
  onClose,
  onConfirm,
  onSuccess,
  playlistID,
  playlistName,
}: Props) {
  const { t } = useTranslation("playlists");

  const { mutate } = api.spotify_playlist.unfollow.useMutation({
    onSuccess() {
      onSuccess();
      onClose();
      //TODO implement optimistic update here
    },
  });

  return (
    <BaseModal isOpen={isOpen} title={t("confirmation")} onClose={onClose}>
      <div className="flex h-3/4 flex-col justify-between pt-4 text-black">
        <div className="text-lg font-medium text-neutral ">
          <p>
            {`${t("operations.confirm_1")} `}
            <span className="font-bold">{playlistName}</span>
            {` ${t("operations.confirm_2")}.`}
          </p>
        </div>
        <ConfirmButtonGroup
          onConfirm={() => {
            mutate({ playlistID: playlistID });
            onConfirm();
          }}
          onClose={onClose}
        />
      </div>
    </BaseModal>
  );
}
