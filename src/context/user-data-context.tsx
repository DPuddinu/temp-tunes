import { useSession } from "next-auth/react";
import { createContext, useState, type ReactNode } from "react";
import { useStore } from "~/core/userStore";
import type { Playlist } from "~/types/spotify-types";
import { api } from "~/utils/api";

interface Data {
  playlists: Playlist[] | undefined;
  setPlaylists: (playlists: Playlist[]) => void;
}
const initialContext: Data = {
  playlists: undefined,
  setPlaylists: () => false
};
export const UserDataContext = createContext<Data>(initialContext);

const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { data } = useSession();
  const { user: storeUser, setUser } = useStore();
  const [playlists, setPlaylists] = useState<Playlist[] | undefined>(undefined)

  // LOADING USER
  // prettier-ignore
  const {} = api.user.getUserBySpotifyId.useQuery(
    undefined, 
    { 
      refetchOnWindowFocus: false, 
      enabled: !storeUser && data?.user?.id !== undefined,
      onSuccess(data) {
        if (!storeUser && data) {
          setUser(data.user);
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
        playlists,
        setPlaylists
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataProvider;
