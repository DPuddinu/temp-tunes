import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useToast } from "~/hooks/use-toast";
import { type TagSchemaType, type TagType } from "~/types/zod-schemas";
import { api } from "~/utils/api";
import { ConfirmButtonGroup } from "../ConfirmationButtonGroup";
import type { BaseModalProps } from "./BaseModal";
import BaseModal from "./BaseModal";

const LoadingSpinner = dynamic(() => import("~/components/ui/LoadingSpinner"));

type Props = {
  trackId: string;
  playlistName?: string;
  tagType: TagType;
} & BaseModalProps;

export function TagModal({ isOpen, onClose, trackId }: Props) {
  const { t } = useTranslation("common");
  const { setMessage } = useToast();
  const [tags, setTags] = useState<TagSchemaType[]>([]);
  const [parent] = useAutoAnimate();
  const utils = api.useContext();

  const { isLoading } = api.tags.getTagsByTrack.useQuery(
    { trackId },
    {
      onSuccess(data) {
        setTags(data);
      },
      enabled: isOpen,
    }
  );

  //prettier-ignore
  const {mutate } = api.tags.setTagsByTrack.useMutation({
    async onSuccess() {
      setMessage(`${t("updated")} tags`);
      onClose();
      utils.tags.orderTagsByName.invalidate();
    },
    onError(){
      onClose();
      setMessage(t("error"));
    }
  });

  return (
    <BaseModal isOpen={isOpen} title={t("edit_tag")} onClose={onClose}>
      <div
        className="flex flex-row flex-wrap gap-2 overflow-hidden pb-2 pt-6"
        ref={parent}
      >
        {isLoading && <LoadingSpinner />}
        {tags.map((tag, i) => (
          <div className="indicator mr-2" key={i}>
            <span
              className="badge indicator-item h-5 w-5 cursor-pointer pb-[2px] text-white"
              onClick={() => {
                const temp = [...tags];
                if (i > -1) {
                  temp.splice(i, 1);
                }
                setTags(temp);
              }}
            >
              <p className=" m-0 text-center">x</p>
            </span>
            <p className="rounded-3xl bg-warning py-1 pr-3 pl-3 text-center font-semibold text-stone-900">
              {tag.name}
            </p>
          </div>
        ))}
      </div>

      <AddTagComponent
        trackId={trackId}
        tags={tags.map((tag) => tag.name)}
        onTagSubmit={(tag: TagSchemaType) => setTags((tags) => [...tags, tag])}
      />
      <ConfirmButtonGroup
        onConfirm={() => {
          mutate({ tags: tags, trackId: trackId });
        }}
        onClose={onClose}
      />
    </BaseModal>
  );
}

const AddTagSchema = z.object({
  tag: z
    .string()
    .min(3, { message: "tag_errors.short" })
    .max(16, { message: "tag_errors.long" }),
});

type AddTagSchemaType = z.infer<typeof AddTagSchema>;

interface AddTagComponentProps {
  tags: string[];
  trackId: string;
  onTagSubmit: (tag: TagSchemaType) => void;
}
function AddTagComponent({ tags, onTagSubmit, trackId }: AddTagComponentProps) {
  const { t } = useTranslation("common");
  const { t: t_modals } = useTranslation("modals");
  const tagSchema = AddTagSchema.refine((item) => !tags.includes(item.tag), {
    message: "tag_errors.used",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddTagSchemaType>({
    resolver: zodResolver(tagSchema),
  });
  const onSubmit: SubmitHandler<AddTagSchemaType> = (data) =>
    onTagSubmit({
      name: data.tag,
      spotifyId: trackId,
    });
  return (
    <form className="flex gap-2 pt-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full ">
        <label className="label">
          <span className="label-text">{t("add_tag")}</span>
        </label>
        <div className="flex gap-2">
          <input
            tabIndex={-1}
            className="input w-full bg-base-100"
            placeholder={t("type_here", { defaultValue: "Type here..." })}
            {...register("tag", { required: true })}
          />
          <button
            tabIndex={-1}
            type="submit"
            className="btn-circle btn border-transparent text-xl transition-transform hover:bg-base-100"
          >
            +
          </button>
        </div>

        {errors?.tag?.message && (
          <label className="label text-red-700">
            <span className="label-text-alt font-bold text-red-700">
              {t_modals(errors?.tag?.message, {
                defaultValue: "Input not valid",
              })}
            </span>
          </label>
        )}
      </div>
    </form>
  );
}
