import { TagModal } from "@components/modals/TagModal";
import { useTranslation } from "next-i18next";
import { useState, type ReactNode } from "react";
import type { Track } from "~/types/spotify-types";
import { cn } from "~/utils/utils";
import { TagIcon } from "./icons/TagSVG";
import { VerticalDots } from "./icons/VerticalDots";

interface Props {
  track: Track;
}
interface DropdownProps {
  children: ReactNode;
  className?: string;
}
const TrackRow = ({ track }: Props) => {
  const { t } = useTranslation("common");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="group flex rounded-xl px-3 text-accent-content hover:bg-neutral">
      <div className="relative flex grow items-center justify-between p-2 hover:text-primary-content">
        <div className="flex grow flex-col gap-1">
          <p className="font-medium ">{track.name}</p>
          <p className="text-sm font-medium text-base-content">
            {track.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
        <DropdownMenu className="hidden group-hover:flex max-h-10">
          <li onClick={() => setIsModalOpen(true)} className="bg-transparent">
            <div className="flex gap-2 rounded-xl">
              <TagIcon />
              <a>{t("add_tag")}</a>
            </div>
          </li>
        </DropdownMenu>
      </div>

      <TagModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onClose={onClose}
        track={track}
        tagType="track"
      />
    </div>
  );
};


function DropdownMenu({ children, className }: DropdownProps) {
  return (
    <div
      className={cn("dropdown-end dropdown-bottom dropdown ", className)}
    >
      <label tabIndex={0} className="m-1">
        <VerticalDots />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
      >
        {children}
      </ul>
    </div>
  );
}
export default TrackRow;
