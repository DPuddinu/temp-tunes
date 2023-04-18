import { useTranslation } from "next-i18next";
import { useRef, useState, type ChangeEvent, useCallback } from "react";
import { z } from "zod";
import type { TagSchemaType, TagType } from "~/types/zod-schemas";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import type { BaseModalProps } from "./BaseModal";
import BaseModal from "./BaseModal";
import { api } from "~/utils/api";

type Props = {
  trackTags: TagSchemaType[];
  trackId: string;
  tagType: TagType;
} & BaseModalProps;
interface ConfirmButtonGroupProps {
  onClose?: () => void;
  onConfirm?: () => void;
}
export function TagModal({
  isOpen,
  onClose,
  trackTags,
  trackId,
  tagType
}: Props) {
  const { t } = useTranslation("modals");

  const [tags, setTags] = useState<TagSchemaType[]>(trackTags ?? []);
  const [removeTags, setRemoveTags] = useState<TagSchemaType[]>([]);
  const { isLoading, isSuccess, mutate, isError } = api.prisma_router.setTags.useMutation();

  const saveTags = useCallback(() => {
    mutate({ addTags: tags, removeTags: removeTags });
  }, [tags.length]);

  function addTag(tagName: string) {
    const newTag: TagSchemaType = {
      name: tagName,
      spotifyId: trackId,
      spotifyType: tagType,
    };
    setTags((oldTags) => {
      return [...oldTags, newTag];
    });
  }

  function removeTag(i: number) {
    const tagToRemove = tags[i] as TagSchemaType;
    setRemoveTags((oldTags) => {
      return [...oldTags, tagToRemove];
    });
    setTags((oldTags) => {
      const temp = [...oldTags];
      if (i > -1) {
        temp.splice(i, 1);
      }
      return temp;
    });
  }

  return (
    <BaseModal isOpen={isSuccess ? false : isOpen} title={t("new_tag")}>
      <div className="flex flex-row flex-wrap gap-2 pb-2">
        {tags.map((tag, i) => (
          <div className="indicator" key={self.crypto.randomUUID()}>
            <span
              className="badge indicator-item h-5 w-5 cursor-pointer pb-[2px] text-white"
              onClick={() => removeTag(i)}
            >
              <p className=" m-0 text-center">x</p>
            </span>
            <p className="w-fit rounded-3xl bg-warning pr-3 pl-3 text-white">
              {tag.name}
            </p>
          </div>
        ))}
      </div>

      <AddTagComponent onAdd={(tagName: string) => addTag(tagName)} tags={tags} />
      <div
        className="flex justify-between"
        style={{ justifyContent: isLoading ? "space-between" : "end" }}
      >
        {isLoading && <LoadingSpinner />}
        <ConfirmButtonGroup onConfirm={saveTags} onClose={onClose} />
      </div>
    </BaseModal>
  );
}

function ConfirmButtonGroup({ onConfirm, onClose }: ConfirmButtonGroupProps) {
  const { t } = useTranslation("modals");
  return (
    <div className="mt-4 flex flex-row-reverse gap-2">
      <button
        type="button"
        className="bg- inline-flex justify-center rounded-md border border-transparent bg-accent-focus px-4 py-2 text-white duration-300 "
        onClick={onConfirm}
      >
        {t("confirm")}
      </button>
      <button
        type="button"
        className="inline-flex justify-center rounded-md border border-transparent  bg-error px-4 py-2 text-white duration-300 "
        onClick={onClose}
      >
        {t("cancel")}
      </button>
    </div>
  );
}
interface AddTagProps {
  onAdd: (tagName: string) => void;
  tags: TagSchemaType[];
}
function AddTagComponent({ onAdd, tags }: AddTagProps) {
  const tagNameRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(" ");
  const { t } = useTranslation("modals");

  function handleAddTag() {
    if (tagNameRef.current) {
      tagNameRef.current.value = "";
      onAdd(tagNameRef.current.value);
    }
  }
  //prettier-ignore
  const validateTag =  (event: ChangeEvent<HTMLInputElement>) => {
      setError("");
      const tagName = event.target.value
      if (!z.string().min(3).safeParse(tagName).success || !tagName) {
        setError("tag_errors.short");
      }
      if (!z.string().max(18).safeParse(tagName).success) {
        setError("tag_errors.long");
      }
      if (tags.map((tag) => tag.name.toLowerCase()).includes(tagName.toLowerCase())) {
        setError("tag_errors.used");
      }
  }
  return (
    <div className="flex gap-2">
      <div className="w-full">
        <input
          ref={tagNameRef}
          type="text"
          placeholder=""
          className="input w-full max-w-xs"
          onChange={validateTag}
        />
        {!!error && (
          <label className="label text-red-700">
            <span className="label-text-alt font-bold text-base-100">
              {t(error)}
            </span>
          </label>
        )}
      </div>

      <button
        disabled={!!error}
        className="btn-circle btn border-transparent bg-accent-focus"
        onClick={handleAddTag}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="white"
          className="h-6 w-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </div>
  );
}
