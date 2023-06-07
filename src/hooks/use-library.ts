import { useMutation } from "@tanstack/react-query";
import { getLibrary } from "~/core/spotifyCollection";
import type { Playlist } from "~/types/spotify-types";

interface Props {
  token: string | undefined | null;
  onFinish: (library: Playlist[]) => void;
  onStart: () => void;
  onProgress: (progress: number, name: string) => void;
}

export const useLibrary = ({ token, onFinish, onStart, onProgress }: Props) => {
  const { mutate, isLoading, isError } = useMutation({
    mutationKey: ["library"],
    mutationFn: () => {
      onStart();
      return getLibrary(
        token ?? "",
        (progress: number, current: string) => {
          onProgress(progress, current);
        },
        (playlists: Playlist[]) => {
          onFinish(playlists);
        }
      );
    },
  });
  return {
    loadLibrary: mutate,
    isLoadingLibrary: isLoading,
    isErrorLibrary: isError,
  };
};
