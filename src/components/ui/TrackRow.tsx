import { TagModal } from "@components/modals/TagModal";
import { useTranslation } from "next-i18next";
import { useState, type ReactNode } from "react";
import type { Track } from "~/types/spotify-types";
import { TagIcon } from "./icons/TagSVG";
import { VerticalDots } from "./icons/VerticalDots";

interface Props {
  track: Track;
}
interface DropdownProps {
  children: ReactNode;
  hidden: boolean;
}
const TrackRow = ({ track }: Props) => {
  const { t } = useTranslation("common");
  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className="flex rounded-xl px-3 text-accent-content hover:bg-neutral "
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
    >
      <div className="flex grow items-center gap-2 hover:text-primary-content">
        <div className="flex flex-col gap-1">
          <p className="font-medium ">{track.name}</p>
          <p className="text-sm font-medium text-base-content">
            {track.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
      </div>
      <DropdownMenu hidden={!isHovering}>
        <li onClick={() => setIsModalOpen(true)}>
          <div className="flex gap-2">
            <TagIcon />
            <a>{t("add_tag")}</a>
          </div>
        </li>
      </DropdownMenu>
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


function DropdownMenu({ children, hidden }: DropdownProps) {
  return (
    <div
      className="dropdown-end dropdown dropdown-bottom "
      style={{ visibility: hidden ? "hidden" : "visible" }}
    >
      <label tabIndex={0} className="m-1">
        <VerticalDots/>
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
