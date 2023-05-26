import type { User } from "@prisma/client";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useMounted } from "~/hooks/use-mounted";
import type { TagsObject } from "~/server/api/routers/prisma_router";
import type { Playlist } from "~/types/spotify-types";

export type PlaylistLibrary = {
  playlists: Playlist[];
  setPlaylists: (playlists: Playlist[]) => void;
};
export type UserStore = {
  user: User | undefined;
  tags: TagsObject | undefined;
  message: string | undefined;
  setTags: (tags: TagsObject) => void;
  setUser: (user: User) => void;
  setMessage: (message: string | undefined) => void
};

const emptyStore = create<PlaylistLibrary>()((set) => ({
  playlists: [],
  setPlaylists: (playlists) => set(() => ({ playlists: playlists })),
}));

const usePersistedStore = create<PlaylistLibrary>()(
  persist(
    (set) => ({
      playlists: [],
      setPlaylists: (playlists) => set(() => ({ playlists: playlists })),
    }),
    {
      name: "nsm-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

const userStore = create<UserStore>()((set) => ({
  tags: undefined,
  user: undefined,
  message: undefined,
  setTags: (tags) => set(() => ({ tags: tags })),
  setUser: (user) => set(() => ({ user: user })),
  setMessage: (message) => set(() => ({ message: message}))
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
