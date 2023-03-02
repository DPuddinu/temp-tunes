import { TagModal } from "@components/modals/TagModal";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { getMedalByPosition } from "../recap/helpers/recap-helpers";
import { DropdownMenu } from "./DropdownMenu";

type Props = {
  label: string;
  artists: string[];
  position?: number;
  showMedals?: boolean;
};

const TrackRow = ({
  label,
  position = 3,
  artists,
  showMedals = false,
}: Props) => {
  const { t } = useTranslation("common");

  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        onConfirm={() => console.log("CONFIRM")}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tagType="track"
      ></TagModal>
    </div>
  );
};

export default TrackRow;
