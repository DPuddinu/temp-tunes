import type { User } from "@prisma/client";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useMounted } from "~/hooks/use-mounted";
import type { Playlist } from "~/types/spotify-types";

export type PlaylistLibrary = {
  playlists: Playlist[] | undefined;
  setPlaylists: (playlists: Playlist[]) => void;
};
export type UserStore = {
  user: User | undefined;
  message: string | undefined;
  setUser: (user: User) => void;
  setMessage: (message: string | undefined) => void
};

const emptyStore = create<PlaylistLibrary>()((set) => ({
  playlists: undefined,
  setPlaylists: (playlists) => set(() => ({ playlists: playlists })),
}));

const usePersistedStore = create<PlaylistLibrary>()(
  persist(
    (set) => ({
      playlists: undefined,
      setPlaylists: (playlists) => set(() => ({ playlists: playlists })),
    }),
    {
      name: "nsm-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'sessionStorage' is used
    }
  )
);

const userStore = create<UserStore>()((set) => ({
  user: undefined,
  message: undefined,
  setUser: (user) => set(() => ({ user: user })),
  setMessage: (message) => {
    if (message) {
      set(() => ({ message: message }))
      setTimeout(() => {
        set(() => ({ message: undefined }))
      }, 3000)
    }
  }
}));

export const useStore = () => {
  return userStore();
};

export const usePlaylistStore = (() => {
  const persistedStore = usePersistedStore();
  const mounted = useMounted();

  return mounted ? persistedStore : emptyStore;
}) as typeof usePersistedStore;

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Playlists", usePersistedStore);
  mountStoreDevtool("User", userStore);
}
