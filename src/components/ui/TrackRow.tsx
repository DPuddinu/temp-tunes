import { TagModal } from "@components/modals/TagModal";
import { useTranslation } from "next-i18next";
import React, { forwardRef, useState } from "react";
import type { Track } from "~/types/spotify-types";
import { DropdownMenu } from "./DropdownMenu";
import { TagSVG } from "./icons/TagSVG";
interface Props {
  track: Track;
}

const TrackRow = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { t } = useTranslation("common");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className="group flex rounded-xl px-3 text-accent-content hover:bg-neutral"
      ref={ref}
    >
      <div className="flex grow items-center justify-between p-2 hover:text-primary-content">
        <div className="flex grow flex-col gap-1">
          <p className="font-medium ">{props.track.name}</p>
          <p className="text-sm font-medium text-base-content">
            {props.track.artists?.map((artist) => artist.name).join(", ")}
          </p>
        </div>
        <DropdownMenu intent={"light"}>
          <li onClick={() => setIsModalOpen(true)} className="bg-transparent">
            <div className="flex gap-2 rounded-xl">
              <TagSVG />
              <a>{t("add_tag")}</a>
            </div>
          </li>
        </DropdownMenu>
      </div>
      {props.track.id && (
        <TagModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          trackId={props.track.id}
          tagType="track"
        />
      )}
    </div>
  );
});
TrackRow.displayName = "TrackRow";

export default TrackRow;
