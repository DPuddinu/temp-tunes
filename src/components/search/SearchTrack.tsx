import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import type {
  Playlist
} from "~/types/spotify-types";
import { getLibrary } from "../../core/searchQueries";
import LoadingScreen from "../ui/LoadingPlaylist";

interface props {
  onFinish: (playlists: Playlist[]) => void;
}
const SearchTrack = ({ onFinish }: props) => {
  const [loading, setLoading] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<string>();
  const [progress, setProgress] = useState<number>();

  const { data } = useSession();

  useQuery({
    queryFn: () => {
      setLoading(true);
      return getLibrary(
        data?.accessToken ?? "",
        (progress: number, current: string) => {
          setCurrentPlaylist(current);
          setProgress(progress);
        },
        (playlists: Playlist[]) => {
          setLoading(false);
          onFinish(playlists);
        }
      );
    },
    enabled: data?.accessToken !== undefined,
  });

  return (
    <>
      {loading && (
        <LoadingScreen current={currentPlaylist} progress={progress} />
      )}
    </>
  );
};

export default SearchTrack;
