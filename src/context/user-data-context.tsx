import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getLibrary } from "~/core/spotifyCollection";
import { usePlaylistStore, useTagsStore } from "~/core/store";
import type { TagsObject } from "~/server/api/routers/prisma_router";
import type { Playlist } from "~/types/spotify-types";
import { api } from "~/utils/api";

interface Data {
  tags: TagsObject | undefined;
  progress: number | undefined;
  currentPlaylist: string | undefined;
}
const initialContext = {
  tags: undefined,
  progress: undefined,
  currentPlaylist: undefined,
};
export const UserDataContext = createContext<Data>(initialContext);

const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [currentPlaylist, setCurrentPlaylist] = useState<string | undefined>(
    undefined
  );
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const { playlists: library, setPlaylists: setLibrary } = usePlaylistStore();
  const { setTags: setStoreTags, tags: storeTags } = useTagsStore();

  // QUERIES
  //prettier-ignore
  const { data: userTags, isLoading, isError, mutate: loadTags } = api.prisma_router.getTagsByUser.useMutation();
  const {
    mutate,
    isLoading: loadingLibrary,
    isError: errorLibrary,
  } = useMutation({
    mutationKey: ["library"],
    mutationFn: () => {
      setLoading(true);
      return getLibrary(
        session?.accessToken ?? "",
        (progress: number, current: string) => {
          setCurrentPlaylist(current);
          setProgress(progress);
        },
        (playlists: Playlist[]) => {
          setLoading(false);
          setLibrary(playlists);
        }
      );
    },
  });

  // LOADING TAGS
  useEffect(() => {
    if (!storeTags) loadTags();
  }, [loadTags, storeTags]);

  // SAVING TAGS
  useEffect(() => {
    if (userTags) setStoreTags(userTags);
  }, [setStoreTags, userTags]);

  // LOADING PLAYLISTS
  useEffect(() => {
    if (library?.length === 0 && session?.accessToken && !loading) mutate();
  }, [library, mutate, session?.accessToken, loading]);

  return (
    <UserDataContext.Provider
      value={{
        tags: storeTags,
        currentPlaylist: currentPlaylist,
        progress: progress,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataProvider;
