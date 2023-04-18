import { useTranslation } from "next-i18next";
import { useCallback, useRef, useState, type ChangeEvent } from "react";
import { z } from "zod";
import type { TagSchemaType } from "~/types/zod-schemas";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import type { BaseModalProps } from "./BaseModal";
import BaseModal from "./BaseModal";

type Props = {
  tags: TagSchemaType[];
  onAdd: (tagName: string) => void;
  onRemove: (tagIndex: number) => void;
} & BaseModalProps;

export function TagModal({
  isOpen,
  onClose,
  tags,
  onConfirm,
  onAdd,
  onRemove,
  isLoading,
}: Props) {
  const { t } = useTranslation("modals");

  const handleAdd = (tagName: string) => {
    onAdd(tagName);
  };

  return (
    <BaseModal isOpen={isOpen} title={t("new_tag")} onConfirm={onConfirm}>
      <div className="flex flex-row flex-wrap gap-2 pb-2">
        {tags.map((tag, i) => (
          <div className="indicator" key={self.crypto.randomUUID()}>
            <span
              className="badge indicator-item h-5 w-5 cursor-pointer pb-[2px] text-white"
              onClick={() => onRemove(i)}
            >
              <p className=" m-0 text-center">x</p>
            </span>
            <p className="w-fit rounded-3xl bg-warning pr-3 pl-3 text-white">
              {tag.name}
            </p>
          </div>
        ))}
      </div>

      <AddTagComponent onAdd={handleAdd} tags={tags} />
      <div
        className="flex justify-between"
        style={{ justifyContent: isLoading ? "space-between" : "end" }}
      >
        {isLoading && <LoadingSpinner />}
        <ConfirmButtonGroup onConfirm={onConfirm} onClose={onClose} />
      </div>
    </BaseModal>
  );
}

function ConfirmButtonGroup({ onConfirm, onClose }: BaseModalProps) {
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
      onAdd(tagNameRef.current.value);
      tagNameRef.current.value = "";
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
