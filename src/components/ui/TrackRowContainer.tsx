import PlayerDataProvider from "~/context/player-context";
import type { Track } from "~/types/spotify-types";
import TrackRow from "./TrackRow";
import type { ForwardedRef } from "react";

export interface TrackProps {
  track: Track;
  options?: TrackDropdownOptions[];
  ref?: ForwardedRef<HTMLDivElement>
}

export type TrackDropdownOptions =
  | "ADD_TO_QUEUE"
  | "ADD_TO_PLAYLIST"
  | "EDIT_TAGS";


const TrackRowContainer = ({track, options, ref}: TrackProps) => {
  return (
    <PlayerDataProvider>
      <TrackRow track={track} options={options} ref={ref}></TrackRow>
    </PlayerDataProvider>
  );
};

export default TrackRowContainer