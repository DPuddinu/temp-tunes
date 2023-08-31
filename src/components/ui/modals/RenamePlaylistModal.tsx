import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { usePlaylistOperations } from "~/hooks/use-playlist-operation";
import { ConfirmButtonGroup } from "../ConfirmationButtonGroup";
import type { BaseModalProps } from "./BaseModal";
import BaseModal from "./BaseModal";

type Props = {
  onConfirm: () => void;
  playlistId: string;
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
  playlistId,
}: Props) {
  const { t } = useTranslation("playlists");
  const { t: t_common } = useTranslation("common");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RenameFormType>({
    defaultValues: {
      id: playlistId,
    },
    resolver: zodResolver(RenamePlaylistSchema),
  });

  const { rename } = usePlaylistOperations(playlistName);

  const onSubmit: SubmitHandler<RenameFormType> = (data) => {
    rename.mutate({
      name: data.name,
      playlistID: data.id,
    });
  };

  useEffect(() => {
    if (isOpen) setValue("name", playlistName);
  }, [setValue, playlistName, isOpen]);

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
              className="input-bordered input w-full max-w-xs bg-base-100 text-base-content"
              {...register("name")}
            />
            {errors?.name?.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {t_common(errors.name.message, {
                    defaultValue: "Input not valid",
                  })}
                </span>
              </label>
            )}
            <ConfirmButtonGroup onClose={onClose} />
          </form>
        </div>
      </div>
    </BaseModal>
  );
}
