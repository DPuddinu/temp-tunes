import { TagModal } from "@components/modals/TagModal";
import { type Tag } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useState } from "react";
import { type TagType } from "~/types/user-types";
import { api } from "~/utils/api";
import { DropdownMenu } from "./DropdownMenu";

type Props = {
  label: string;
  artists: string[];
  spotifyId: string;
  tagType: TagType;
  trackTags: Tag[];
};

const TrackRow = ({
  label,
  artists,
  spotifyId,
  tagType,
  trackTags,
}: Props) => {
  const { t } = useTranslation("common");
  const session = useSession();

  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>(trackTags ?? []);

  // prettier-ignore
  const { data, isLoading, isSuccess, mutate, isError } = api.prisma_router.setTags.useMutation();

  const saveTags = useCallback(() => {
    mutate({
      userId: session?.data?.user?.id ?? "",
      tags,
    });
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
              tagType,
              session.data?.user?.id ?? "",
              tags
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
  spotifyType: TagType,
  userId: string,
  tags: Tag[]
): Tag[] {
  const newTag = {
    name: tagName,
    spotifyId: spotifyId,
    spotifyType: spotifyType,
    userId: userId,
  };
  return [...tags, newTag];
}

function removeTag(tagIndex: number, tags: Tag[]): Tag[] {
  const newTagList = [...tags];
  if (tagIndex > -1) {
    newTagList.splice(tagIndex, 1);
  }
  return newTagList;
}