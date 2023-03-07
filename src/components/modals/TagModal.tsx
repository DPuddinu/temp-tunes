import type { Tag } from "@prisma/client";
import AddTagComponent from "@ui/AddTagComponent";
import { useTranslation } from "next-i18next";
import type { BaseModalProps } from "./BaseModal";
import BaseModal from "./BaseModal";

type Props = {
  tags: Tag[];
  onAdd: (tagName: string) => void;
} & BaseModalProps;

export function TagModal({ isOpen, onClose, tags, onConfirm, onAdd }: Props) {
  const { t } = useTranslation("modals");

  const handleAdd = (tagName: string) => {
    onAdd(tagName);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("new_tag")}
      onConfirm={onConfirm}
    >
      <div className="flex flex-row flex-wrap gap-2 pb-2">
        {tags.map((tag, i) => (
          <p
            key={self.crypto.randomUUID()}
            className="w-fit rounded-3xl bg-warning pr-3 pl-3 text-white"
          >
            {tag.name}
          </p>
        ))}
      </div>

      <AddTagComponent onAdd={handleAdd} tags={tags}/>
    </BaseModal>
  );
}
