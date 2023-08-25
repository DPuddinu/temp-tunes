import resources from "~/@types/resources";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/utils/api";
import { ConfirmButtonGroup } from "../ui/ConfirmationButtonGroup";
import type { BaseModalProps } from "./BaseModal";
import BaseModal from "./BaseModal";
const commonRes = resources.common;
const playlistRes = resources.playlists;

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
      const msg = `${playlistRes.operations.removed} ${playlistName} ${playlistRes.operations.confirm_2}`;
      setMessage(msg);
      onClose();
    },
    onError(error, variables, context) {
      utils.setData(undefined, context?.prevData);
      setMessage(commonRes.error);
    },
  });

  return (
    <BaseModal
      isOpen={isOpen}
      title={playlistRes.confirmation}
      onClose={onClose}
    >
      <div className="flex h-3/4 flex-col justify-between pt-4 ">
        <div className="text-lg font-medium text-base-content">
          <p>
            {`${playlistRes.operations.confirm_1} `}
            <span className="font-bold">{playlistName}</span>
            {` ${playlistRes.operations.confirm_2}.`}
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
