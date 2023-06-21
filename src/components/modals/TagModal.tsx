import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useStore } from "~/core/store";
import { type TagSchemaType, type TagType } from "~/types/zod-schemas";
import { api } from "~/utils/api";
import { ConfirmButtonGroup } from "../ui/ConfirmationButtonGroup";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import type { BaseModalProps } from "./BaseModal";
import BaseModal from "./BaseModal";

type Props = {
  trackId: string;
  playlistName?: string;
  tagType: TagType;
} & BaseModalProps;

export function TagModal({ isOpen, onClose, trackId }: Props) {
  const { t } = useTranslation("modals");
  const [removeTags, setRemoveTags] = useState<TagSchemaType[]>([]);
  const { tags: storeTags, setTags: setStoreTags, setMessage } = useStore();
  const [tags, setTags] = useState<TagSchemaType[]>([]);

  useEffect(() => {
    if (storeTags) {
      const stored = storeTags[trackId];
      if (stored) setTags(stored);
    }
  }, [storeTags, setTags, trackId]);

  //prettier-ignore
  const { isLoading, mutate } = api.tags.setTags.useMutation({
    onSuccess(data) {
      setStoreTags(data);
      onClose();
    },
    onError(){
      onClose();
      setMessage(t("wrong") ?? "Something went wrong");
    }
  });

  const removeTag = useCallback(
    (i: number) => {
      const tagToRemove = tags[i] as TagSchemaType;
      setRemoveTags((oldTags) => {
        return [...oldTags, tagToRemove];
      });
      const temp = [...tags];
      if (i > -1) {
        temp.splice(i, 1);
      }
      setTags(temp);
    },
    [setTags, tags]
  );

  return (
    <BaseModal isOpen={isOpen} title={t("new_tag")} onClose={onClose}>
      <div className="flex flex-row flex-wrap gap-2 overflow-hidden pb-2 pt-6">
        {tags.map((tag, i) => (
          <div className="indicator mr-2" key={i}>
            <span
              className="badge indicator-item h-5 w-5 cursor-pointer pb-[2px] text-white"
              onClick={() => removeTag(i)}
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
        onConfirm={() => mutate({ addTags: tags, removeTags: removeTags })}
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
  const { t } = useTranslation("modals");
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
  console.log(errors);
  const onSubmit: SubmitHandler<AddTagSchemaType> = (data) =>
    onTagSubmit({
      name: data.tag,
      spotifyId: trackId,
    });

  return (
    <form className="flex gap-2 pt-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full ">
        <input
          tabIndex={-1}
          className="input w-full "
          {...register("tag", { required: true })}
        />
        {Object.keys(errors).length > 0 && (
          <>
            {Object.values(errors).map((error, i) => (
              <label key={i} className="label text-red-700">
                <span className="label-text-alt font-bold text-red-700">
                  {`${t(error.message ?? "")}`}
                </span>
              </label>
            ))}
          </>
        )}
      </div>
      <button
        tabIndex={-1}
        type="submit"
        className="btn-circle btn border-transparent text-xl transition-transform"
      >
        +
      </button>
    </form>
  );
}
