import { useTranslation } from "next-i18next";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/utils/api";
import { ConfirmButtonGroup } from "../ui/ConfirmationButtonGroup";
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
  const utils = api.useContext().spotify_playlist.getAll;
  const { setMessage } = useToast();

  const { mutate } = api.spotify_playlist.remove.useMutation({
    async onMutate({ playlistID }) {
      await utils.cancel();
      const prevData = utils.getData();

      //prettier-ignore
      utils.setData(undefined, (old) => old?.filter((t) => t.id !== playlistID));

      return { prevData };
    },
    onSuccess() {
      const msg = `${t("removed")} ${playlistName} ${t(
        "operations.confirm_2"
      )}`;
      setMessage(msg);
      onClose();
    },
    onError(error, variables, context) {
      utils.setData(undefined, context?.prevData);
      setMessage(`${t(error.message)}`);
    },
  });

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
            mutate({ playlistID: playlistID });
            onConfirm();
          }}
          onClose={onClose}
        />
      </div>
    </BaseModal>
  );
}
