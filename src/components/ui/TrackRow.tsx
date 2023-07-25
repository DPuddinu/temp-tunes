import { useTranslation } from "next-i18next";
import { forwardRef, useContext, useMemo, useState } from "react";
import { TagModal } from "~/components/modals/EditTagModal";
import { PlayerDataContext } from "~/context/player-context";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/utils/api";
import DropdownMenu, { type DropdownOptionProps } from "./DropdownMenu";
import type { TrackProps } from "./TrackRowContainer";

const TrackRow = forwardRef<HTMLDivElement, TrackProps>(
  ({ track, options }, ref) => {
    const { t } = useTranslation("common");
    const { uri, name, artists, id } = track;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { state } = useContext(PlayerDataContext);
    const { setMessage } = useToast();

    const dropdownOptions: DropdownOptionProps[] | undefined = useMemo(() => {
      if (!options) return undefined;
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
              onClick: () =>
                addToQueue({
                  uri: uri,
                }),
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
      return opts;
    }, [options, setMessage]);

    const { mutate: playTrack } = api.player.togglePlayPause.useMutation();
    const { mutate: addToQueue } = api.player.addToQueue.useMutation({
      onSuccess() {
        const msg = `${name} ${t("added_to_queue")}`;
        setMessage(msg);
      },
    });

    return (
      <div
        className="group flex rounded-xl px-3 text-accent-content hover:cursor-pointer hover:bg-neutral"
        ref={ref}
      >
        <div className="flex grow items-center justify-between p-2 hover:text-primary-content">
          <div
            className="flex grow flex-col gap-1"
            onClick={() =>
              playTrack({
                uris: [uri],
                playbackState: state !== null,
              })
            }
          >
            <p className="font-medium ">{name}</p>
            <p className="text-sm font-medium text-base-content">
              {artists?.map((artist) => artist.name).join(", ")}
            </p>
          </div>
          {dropdownOptions && (
            <DropdownMenu intent={"light"}>
              <DropdownMenu.Options options={dropdownOptions} />
            </DropdownMenu>
          )}
        </div>
        {id && (
          <TagModal
            key={id}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            trackId={id}
            tagType="track"
          />
        )}
      </div>
    );
  }
);
TrackRow.displayName = "TrackRow";

export default TrackRow;
