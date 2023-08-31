import { useTranslation } from "next-i18next";
import { usePlaylistOperations } from "~/hooks/use-playlist-operation";
import { ConfirmButtonGroup } from "../ConfirmationButtonGroup";
import type { BaseModalProps } from "./BaseModal";
import BaseModal from "./BaseModal";

type Props = {
  onConfirm: () => void;
  playlistID: string;
  playlistName: string;
} & BaseModalProps;

export function UnfollowModal({
  isOpen,
  onClose,
  onConfirm,
  playlistID,
  playlistName,
}: Props) {
  const { t } = useTranslation("playlists");

  const { remove } = usePlaylistOperations(playlistName);

  return (
    <BaseModal isOpen={isOpen} title={t("confirmation")} onClose={onClose}>
      <div className="flex h-3/4 flex-col justify-between pt-4 ">
        <div className="text-lg font-medium text-base-content">
          <p>
            {`${t("operations.confirm_1")} `}
            <span className="font-bold">{playlistName}</span>
            {` ${t("operations.confirm_2")}.`}
          </p>
        </div>
        <ConfirmButtonGroup
          onConfirm={() => {
            remove.mutate({ playlistID: playlistID });
            onConfirm();
          }}
          onClose={onClose}
        />
      </div>
    </BaseModal>
  );
}
