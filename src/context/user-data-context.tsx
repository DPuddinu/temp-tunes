import { useSession } from "next-auth/react";
import { createContext, useEffect, type ReactNode } from "react";
import { usePlaylistStore, useStore } from "~/core/userStore";
import type { TagsObject } from "~/server/api/routers/tags_router";
import { api } from "~/utils/api";
interface Data {
  tags: TagsObject | undefined;
}
const initialContext: Data = {
  tags: undefined,
};
export const UserDataContext = createContext<Data>(initialContext);

const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { data } = useSession();
  const { setTags: setStoreTags, user: storeUser, setUser } = useStore();
  const { playlists, setPlaylists } = usePlaylistStore();

  // LOADING USER
  // prettier-ignore
  const { data: user } = api.user.getUserBySpotifyId.useQuery(
    undefined, 
    { 
      refetchOnWindowFocus: false, 
      enabled: !storeUser && data?.user?.id !== undefined,
      onSuccess(data) {
        if (!storeUser && data) {
          setUser(data.user);
          setStoreTags(data.tags);
        }
      }
    }
  )

  api.spotify_playlist.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    enabled: playlists === undefined && data?.accessToken !== undefined,
    onSuccess(data) {
      setPlaylists(data);
    },
  });

  return (
    <UserDataContext.Provider
      value={{
        tags: user?.tags ?? {},
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataProvider;
