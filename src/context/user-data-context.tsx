import { useSession } from "next-auth/react";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { usePlaylistStore, useStore } from "~/core/store";
import { useLibrary } from "~/hooks/use-library";
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
  const { setTags: setStoreTags, tags: storeTags, user: storeUser, setUser } = useStore();

  // ----------------------------------------------------------------

  // LOADING LIBRARY
  const { loadLibrary, isLoadingLibrary, isErrorLibrary } = useLibrary({
    token: session?.accessToken,
    onStart: () => setLoading(true),
    onProgress: (progress: number, name: string) => {
      setCurrentPlaylist(name);
      setProgress(progress);
    },
    onFinish: (library: Playlist[]) => {
      setLoading(false);
      setLibrary(library);
    },
  });
  useEffect(() => {
    if (library?.length === 0 && session?.accessToken && !loading)
      loadLibrary();
  }, [library, loadLibrary, session?.accessToken, loading]);

  // ----------------------------------------------------------------

  // LOADING USER
  // prettier-ignore
  const { data: user } = api.user_router.getUserBySpotifyId.useQuery({ spotifyId: session?.user?.id}, { refetchOnWindowFocus: false, enabled: session?.user?.id !== undefined})

  useEffect(() => {
    if(!storeUser && user){
      setUser(user.user)
      setStoreTags(user.tags)
    }
  }, [user, setUser, storeUser]);

  // ----------------------------------------------------------------

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
