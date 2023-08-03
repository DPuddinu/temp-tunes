import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getLibrary } from "~/core/spotifyCollection";
import type { Playlist } from "~/types/spotify-types";

interface Props {
  onFinish: (library: Playlist[]) => void;
  onStart: () => void;
  onProgress: (progress: number, name: string) => void;
}

export const useLibrary = ({ onFinish, onStart, onProgress }: Props) => {
  const { data } = useSession()

  const { mutate, isLoading, isError } = useMutation({
    mutationKey: ["getLibrary"],
    mutationFn: () => {
      onStart();
      return getLibrary(
        data?.accessToken ?? "",
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
