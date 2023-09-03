import { type Playlist, type Track } from "~/types/spotify-types";
import { api } from "~/utils/api";
import VirtualScroll from "../ui/VirtualScroll";
import dynamic from "next/dynamic";

interface props {
  data: Playlist;
}

const TrackRow = dynamic(() => import("~/components/ui/TrackRow"));

const PlaylistDetails = ({ data }: props) => {
  const { data: playlists } = api.spotify_playlist.getAll.useQuery();

  return (
    <div className="m-auto flex h-full max-h-[36rem] max-w-md flex-col rounded-xl bg-base-300 p-2 ">
      <div className="p-4">
        <h1 className="my-1 text-2xl font-semibold tracking-wider">
          {data?.name}
        </h1>
        <p className="ml-1 text-sm font-medium leading-4">
          {data?.owner.display_name}
        </p>
      </div>
      <div className="grow">
        <VirtualScroll
          height="100%"
          data={data.tracks}
          row={(virtualItem) => (
            <TrackRow
              track={data.tracks[virtualItem.index] as Track}
              playlists={playlists}
            />
          )}
        />
      </div>
    </div>
  );
};

export default PlaylistDetails;
