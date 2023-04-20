import { TagModal } from "@components/modals/TagModal";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { type TagSchemaType } from "~/types/zod-schemas";
import { DropdownMenu } from "./DropdownMenu";

type Props = {
  label: string;
  artists: string[];
  spotifyId: string;
  trackTags: TagSchemaType[];
};

const TrackRow = ({ label, artists, spotifyId, trackTags }: Props) => {
  const { t } = useTranslation("common");

  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tags, setTags] = useState<TagSchemaType[]>(trackTags ?? []);

  // prettier-ignore

  const onClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setTags(trackTags), 300); // restore tags after animation finishes
  };

  return (
    <div
      className="flex rounded-xl px-3 text-accent-content hover:bg-neutral "
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
    >
      <div className="flex grow items-center gap-2 hover:text-primary-content">
        <div className="flex flex-col gap-1">
          <p className="text-base font-medium">{label}</p>
          <p className="text-sm font-medium">{artists.join(", ")}</p>
        </div>
      </div>
      <DropdownMenu hidden={!isHovering}>
        <li onClick={() => setIsModalOpen(true)}>
          <a>{t("add_tag")}</a>
        </li>
      </DropdownMenu>
      <TagModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onClose={onClose}
        trackTags={tags}
        trackId={spotifyId}
        tagType="track"
      />
    </div>
  );
};

export default TrackRow;
