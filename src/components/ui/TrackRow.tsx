import { TagModal } from "@components/modals/TagModal";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import type { Track } from "~/types/spotify-types";
import { DropdownMenu } from "./DropdownMenu";
import { TagIcon } from "./icons/TagSVG";

interface Props {
  track: Track;
}

const TrackRow = ({ track }: Props) => {
  const { t } = useTranslation("common");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="group flex rounded-xl px-3 text-accent-content hover:bg-neutral">
      <div className="flex grow items-center justify-between p-2 hover:text-primary-content">
        <div className="flex grow flex-col gap-1">
          <p className="font-medium ">{track.name}</p>
          <p className="text-sm font-medium text-base-content">
            {track.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
        <DropdownMenu intent={"light"}>
          <li onClick={() => setIsModalOpen(true)} className="bg-transparent">
            <div className="flex gap-2 rounded-xl">
              <TagIcon />
              <a>{t("add_tag")}</a>
            </div>
          </li>
        </DropdownMenu>
      </div>
      {track.id && (
        <TagModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          trackId={track.id}
          tagType="track"
        />
      )}
    </div>
  );
};

export default TrackRow;
