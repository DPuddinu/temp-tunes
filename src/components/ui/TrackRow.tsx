import { TagModal } from "@components/modals/TagModal";
import { type Tag } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useCallback, useState } from "react";
import { type TagType } from "~/types/user-types";
import { api } from "~/utils/api";
import { getMedalByPosition } from "../recap/helpers/recap-helpers";
import { DropdownMenu } from "./DropdownMenu";

type Props = {
  label: string;
  artists: string[];
  position?: number;
  spotifyId: string;
  spotifyType: TagType;
  showMedals?: boolean;
  trackTags: Tag[];
};

const TrackRow = ({
  label,
  position = 3,
  artists,
  spotifyId,
  spotifyType,
  showMedals = false,
  trackTags,
}: Props) => {
  const { t } = useTranslation("common");
  const session = useSession();

  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tagApi = api.prisma_router.createTags.useMutation();
  const [tags, setTags] = useState<Tag[]>(trackTags ?? []);

  const onConfirm = useCallback(() => {
    tagApi.mutate(tags);
    console.log(tags);
  }, [tags.length]);

  const onAdd = (tagName: string) => {
    const newTag = {
      name: tagName,
      spotifyId: spotifyId,
      spotifyType: spotifyType,
      userId: session.data?.user?.id ?? "",
    };
    setTags((tagList) => [...tagList, newTag]);
  };

  return (
    <div
      className="flex rounded-xl p-3 text-accent-content hover:bg-neutral"
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
    >
      <div className="flex grow items-center gap-2">
        {showMedals && (
          <div className="min-h-[24px] min-w-[24px] text-xl">
            {getMedalByPosition(position)}
          </div>
        )}

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
        onAdd={onAdd}
        onConfirm={onConfirm}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tags={tags}
      />
    </div>
  );
};

export default TrackRow;
