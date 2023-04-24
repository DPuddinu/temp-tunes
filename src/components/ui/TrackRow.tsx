import { TagModal } from "@components/modals/TagModal";
import { useTranslation } from "next-i18next";
import { useState, type ReactNode } from "react";
import type { Track } from "~/types/spotify-types";

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
          <div className="flex flex-row gap-2">
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

const TagIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6h.008v.008H6V6z"
      />
    </svg>
  );
};
function DropdownMenu({ children, hidden }: DropdownProps) {
  return (
    <div
      className="dropdown-end dropdown dropdown-bottom "
      style={{ visibility: hidden ? "hidden" : "visible" }}
    >
      <label tabIndex={0} className="m-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6 cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
          />
        </svg>
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
