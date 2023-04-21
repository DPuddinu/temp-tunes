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
export type UserLibrary = {
  tags: TagsObject | undefined;
  setTags: (tags: TagsObject) => void;
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

const userStore = create<UserLibrary>()((set) => ({
  tags: undefined,
  setTags: (tags) => set(() => ({ tags: tags })),
}));

export const useTagsStore = () => {
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
