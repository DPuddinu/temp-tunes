import { useTranslation } from "next-i18next";
import { api } from "~/utils/api";
import { ConfirmButtonGroup } from "../ui/ConfirmationButtonGroup";
import type { BaseModalProps } from "./BaseModal";
import BaseModal from "./BaseModal";
import { BottomModal } from "./BottomModal";
import useMediaQuery from "~/hooks/use-media-query";

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
  setIsOpen,
  playlistID,
  playlistName,
}: Props) {
  const { t } = useTranslation("playlists");
  const matches = useMediaQuery('(min-width: 640px)')
  const { mutate } = api.spotify_playlist.unfollowPlaylist.useMutation({
    onSuccess() {
      setIsOpen(false);
      onSuccess();
    },
  });

  return (
    <>
      {matches ? (
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
      ) : (
        <BottomModal
          isOpen={isOpen}
          title={t("confirmation")}
          onClose={onClose}
        >
          <div className="flex h-full flex-col justify-between">
            <div className="text-lg font-medium text-neutral ">
              <p>
                {`${t("operations.confirm_1")} `}
                <span className="font-bold">{playlistName}</span>
                {` ${t("operations.confirm_2")}.`}
              </p>
            </div>
            <div className="flex w-full gap-2 pb-4">
              <div
                className="text-semibold btn relative grow border-none bg-red-400 text-info-content shadow-sm"
                onClick={onClose}
              >
                {t("cancel")}
              </div>
              <div
                className="text-semibold btn grow border-none bg-green-400 text-info-content shadow-sm "
                 onClick={() => {
                  mutate({ playlistID: playlistID });
                  onConfirm();
                }}
              >
                {t("confirm")}
              </div>
            </div>
          </div>
        </BottomModal>
      )}
    </>
  );
}

