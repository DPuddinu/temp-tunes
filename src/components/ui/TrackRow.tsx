import { TagModal } from "@components/modals/TagModal";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useState } from "react";
import { type TagSchemaType } from "~/types/user-types";
import { api } from "~/utils/api";
import { DropdownMenu } from "./DropdownMenu";

type Props = {
  label: string;
  artists: string[];
  spotifyId: string;
  trackTags: TagSchemaType[];
};

const TrackRow = ({
  label,
  artists,
  spotifyId,
  trackTags,
}: Props) => {
  const { t } = useTranslation("common");
  const session = useSession();

  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tags, setTags] = useState<TagSchemaType[]>(trackTags ?? []);

  // prettier-ignore
  const { data, isLoading, isSuccess, mutate, isError } = api.prisma_router.setTags.useMutation();

  const saveTags = useCallback(() => {
    mutate({ tags });
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
        onAdd={(tagName) =>
          setTags(
            addTag(
              tagName,
              spotifyId,
              session.data?.user?.id ?? "",
              tags,
              label
            )
          )
        }
        isLoading={isLoading}
        onRemove={(i) => setTags(removeTag(i, tags))}
        onConfirm={saveTags}
        isOpen={isModalOpen}
        onClose={onClose}
        tags={tags}
      />
    </div>
  );
};

export default TrackRow;

function addTag(
  tagName: string,
  spotifyId: string,
  userId: string,
  tags: TagSchemaType[],
  trackName: string
): TagSchemaType[] {
  const newTag: TagSchemaType = {
    name: tagName,
    spotifyId: spotifyId,
    spotifyType: "track",
    userId: userId,
    spotifyName: trackName,
  };
  return [...tags, newTag];
}

function removeTag(tagIndex: number, tags: TagSchemaType[]): TagSchemaType[] {
  const newTagList = [...tags];
  if (tagIndex > -1) {
    newTagList.splice(tagIndex, 1);
  }
  return newTagList;
}