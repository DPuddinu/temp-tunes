import AddTagComponent from "@ui/AddTagComponent";
import { useTranslation } from "next-i18next";
import type { TagSchemaType } from "~/types/zod-schemas";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import type { BaseModalProps } from "./BaseModal";
import BaseModal from "./BaseModal";
import { ConfirmButtonGroup } from "./ConfirmButtonGroup";

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
