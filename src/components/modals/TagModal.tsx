import AddTagComponent from "@ui/AddTagComponent";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import type { TagSpotifyType } from "src/types/spotify-types";
import type { BaseModalProps } from "./BaseModal";
import BaseModal from "./BaseModal";

type Props = {
  tagType: TagSpotifyType;
} & BaseModalProps;

export function TagModal({ isOpen, tagType, onClose }: Props) {
  const { t } = useTranslation("modals");
  const [tagList, setTagList] = useState<string[]>([]);

  const handleConfirm = () => {
    //TODO handle confirmation
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("new_tag")}
      onConfirm={handleConfirm}
    >
      <div className="flex flex-row flex-wrap gap-2 pb-2">
        {tagList.map((tag, i) => (
          <p
            key={self.crypto.randomUUID()}
            className="w-fit rounded-3xl bg-warning pr-3 pl-3 text-white"
          >
            {tag}
          </p>
        ))}
      </div>

      <AddTagComponent
        onAdd={(newTag) => setTagList((tagList) => [...tagList, newTag])}
      ></AddTagComponent>
    </BaseModal>
  );
}
