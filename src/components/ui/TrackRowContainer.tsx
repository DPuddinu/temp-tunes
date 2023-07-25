import { type ForwardedRef } from "react";
import PlayerDataProvider from "~/context/player-context";
import { usePlaylistStore } from "~/core/userStore";
import type { Playlist, Track } from "~/types/spotify-types";
import TrackRow from "./TrackRow";

export interface TrackProps {
  track: Track;
  playlists?: Playlist[];
  options?: TrackDropdownOptions[];
  ref?: ForwardedRef<HTMLDivElement>;
}

export type TrackDropdownOptions = "ADD_TO_QUEUE" | "EDIT_TAGS";

const TrackRowContainer = ({ track, options, ref }: TrackProps) => {
  const { playlists } = usePlaylistStore();
  
  return (
    <PlayerDataProvider>
      <TrackRow
        track={track}
        options={options}
        ref={ref}
        playlists={playlists}
      />
    </PlayerDataProvider>
  );
};

export default TrackRowContainer;
