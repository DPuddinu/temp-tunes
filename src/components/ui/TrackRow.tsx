import { TagModal } from "@components/modals/TagModal";
import { useTranslation } from "next-i18next";
import React, { forwardRef, useState } from "react";
import type { Track } from "~/types/spotify-types";
import { api } from "~/utils/api";
import { DropdownMenu } from "./DropdownMenu";
import { TagSVG } from "./icons/TagSVG";
interface Props {
  track: Track;
}

const TrackRow = forwardRef<HTMLDivElement, Props>(({ track }, ref) => {
  const { t } = useTranslation("common");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: playTrack, isLoading } = api.player.play.useMutation({
    onError: () => {
      console.log("error");
    },
    onSuccess(data, variables, context) {
      console.log(data);
    },
  });
  return (
    <div
      className="group flex rounded-xl px-3 text-accent-content hover:bg-neutral"
      ref={ref}
    >
      <div className="flex grow items-center justify-between p-2 hover:text-primary-content">
        <div
          className="flex grow flex-col gap-1"
          onClick={() =>
            playTrack({
              uris: [track.uri],
            })
          }
        >
          <p className="font-medium ">{track.name}</p>
          <p className="text-sm font-medium text-base-content">
            {track.artists?.map((artist) => artist.name).join(", ")}
          </p>
        </div>
        <DropdownMenu intent={"light"}>
          <li onClick={() => setIsModalOpen(true)} className="bg-transparent">
            <div className="flex gap-2 rounded-xl">
              <TagSVG />
              <a>{t("edit_tag")}</a>
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
});
TrackRow.displayName = "TrackRow";

export default TrackRow;
