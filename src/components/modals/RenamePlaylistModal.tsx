import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
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

const RenamePlaylistSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, {
      message: "name_min_len",
    })
    .max(50, {
      message: "name_max_len",
    }),
});
export type RenameFormType = z.infer<typeof RenamePlaylistSchema>;

export function RenameModal({
  isOpen,
  onClose,
  playlistName,
  playlistID,
}: Props) {
  const { t } = useTranslation("playlists");
  const { t: t_common } = useTranslation("common");

  const utils = api.useContext().spotify_playlist.getAll;
  const { setMessage } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RenameFormType>({
    defaultValues: {
      id: playlistID,
    },
    resolver: zodResolver(RenamePlaylistSchema),
  });

  const { mutate } = api.spotify_playlist.rename.useMutation({
    async onMutate({ name, playlistID }) {
      await utils.cancel();
      const prevData = utils.getData();

      //prettier-ignore
      utils.setData(undefined, (old) => old?.map((t) => {
        if(t.id === playlistID){
          t.name = name;
        }
        return t
      }));

      return { prevData };
    },
    onSuccess() {
      onClose();
      setMessage(`Playlist ${t("renamed")}`);
    },
    onError(error, variables, context) {
      utils.setData(undefined, context?.prevData);
      setMessage(`${t_common("error")}`);
    },
  });

  const onSubmit: SubmitHandler<RenameFormType> = (data) => {
    mutate({
      name: data.name,
      playlistID: data.id,
    });
  };

  useEffect(() => {
    if (isOpen) setValue("name", playlistName);
  }, [setValue, playlistName, isOpen]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <BaseModal isOpen={isOpen} title={t("operations.rename")} onClose={onClose}>
      <div className="flex h-3/4 flex-col justify-between pt-4 text-black">
        <div className="text-lg font-medium text-neutral ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="label">
              <span className="label-text">{t("playlist_name")}</span>
            </label>
            <input
              type="text"
              className="input-bordered input w-full max-w-xs text-white"
              {...register("name")}
            />
            {errors?.name?.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {t_common(errors.name.message)}
                </span>
              </label>
            )}
            <ConfirmButtonGroup />
          </form>
        </div>
      </div>
    </BaseModal>
  );
}
