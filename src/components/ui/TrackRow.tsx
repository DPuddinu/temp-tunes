import { TagModal } from "@components/modals/TagModal";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useState } from "react";
import { type TagSchemaType } from "~/types/zod-schemas";
import { api } from "~/utils/api";
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
  const [removeTags, setRemoveTags] = useState<TagSchemaType[]>([]);

  // prettier-ignore
  const { data, isLoading, isSuccess, mutate, isError } = api.prisma_router.setTags.useMutation();

  const saveTags = useCallback(() => {
    mutate({ addTags: tags, removeTags: removeTags });
  }, [tags.length]);

  useEffect(() => {
    setIsModalOpen(false);
  }, [isSuccess]);

  const onClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setTags(trackTags), 300); // restore tags after animation finishes
  };

  return (
    <div
      className="flex rounded-xl px-3 text-accent-content hover:bg-neutral"
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
    >
      <div className="flex grow items-center gap-2">
        <div className="flex flex-col gap-1">
          <p className="text-base">{label}</p>
          <p className="text-xs">{artists.join(", ")}</p>
        </div>
      </div>
      <DropdownMenu hidden={!isHovering}>
        <li onClick={() => setIsModalOpen(true)}>
          <a>{t("add_tag")}</a>
        </li>
      </DropdownMenu>
      <TagModal
        onAdd={(tagName) => {
          const newTag: TagSchemaType = {
            name: tagName,
            spotifyId: spotifyId,
            spotifyType: "track",
          };
          setTags((oldTags) => {
            return [...oldTags, newTag];
          });
          
        }}
        isLoading={isLoading}
        onRemove={(i) => {
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
          
        }}
        onConfirm={saveTags}
        isOpen={isModalOpen}
        onClose={onClose}
        tags={tags}
      />
    </div>
  );
};

export default TrackRow;
