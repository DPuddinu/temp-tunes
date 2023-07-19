import { TagModal } from "@components/modals/TagModal";
import { useTranslation } from "next-i18next";
import { forwardRef, useMemo, useState } from "react";
import type { Track } from "~/types/spotify-types";
import { api } from "~/utils/api";
import DropdownMenu, { type DropdownOptionProps } from "./DropdownMenu";
interface Props {
  track: Track;
  options?: TrackDropdownOptions[];
}
export type TrackDropdownOptions = 'ADD_TO_QUEUE' | 'ADD_TO_PLAYLIST' | 'EDIT_TAGS'

const TrackRow = forwardRef<HTMLDivElement, Props>(({ track, options }, ref) => {
  const { t } = useTranslation("common");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dropdownOptions: DropdownOptionProps[] | undefined = useMemo(() => {
    if(!options) return undefined;
    const opts: DropdownOptionProps[] = options.map((option) => {
      let action: DropdownOptionProps;
      switch (option) {
        case "EDIT_TAGS": {
          action = {
            label: t("edit_tag"),
            onClick: () => setIsModalOpen(true),
          };
          break;
        }
        case "ADD_TO_QUEUE": {
          action = {
            label: t("add_to_queue"),
            disabled: true,
            onClick: () => false,
          };
          break;
        }
        case "ADD_TO_PLAYLIST": {
          action = {
            label: t("add_to_playlist"),
            disabled: true,
            onClick: () => false,
          };
          break;
        }
      }
      return action;
    });
    return opts

  }, [options, t]);

  const { mutate: playTrack } = api.player.togglePlayPause.useMutation();
  return (
    <div
      className="group flex rounded-xl px-3 text-accent-content hover:bg-neutral hover:cursor-pointer"
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
        {dropdownOptions && (
          <DropdownMenu intent={"light"}>
            <DropdownMenu.Options options={dropdownOptions} />
          </DropdownMenu>
        )}
      </div>
      {track.id && (
        <TagModal
          key={track.id}
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
