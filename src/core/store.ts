import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useMounted } from "~/hooks/use-mounted";
import type { TagsObject } from "~/server/api/routers/prisma_router";
import type { Playlist } from "~/types/spotify-types";

export type UserLibrary = {
  playlists: Playlist[];
  tags: TagsObject;
};
type UserLibraryActions = {
  setPlaylists: (playlists: Playlist[]) => void;
  setTags: (tags: TagsObject) => void;
};

const emptyStore = create<UserLibrary & UserLibraryActions>()((set) => ({
  playlists: [],
  tags: {},
  setTags: (tags) => set(() => ({ tags: tags })),
  setPlaylists: (playlists) => set(() => ({ playlists: playlists })),
}));

const usePersistedStore = create<UserLibrary & UserLibraryActions>()(
  persist(
    (set) => ({
      playlists: [],
      tags: {},
      setTags: (tags) => set(() => ({ tags: tags })),
      setPlaylists: (playlists) => set(() => ({ playlists: playlists })),
    }),
    {
      name: "asm-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export const useStore = (() => {
  /*
  This a fix to ensure zustand never hydrates the store before React hydrates the page.
  Without this, there is a mismatch between SSR/SSG and client side on first draw which produces
  an error.
   */
  const persistedStore = usePersistedStore();
  const mounted = useMounted()

  return mounted ? persistedStore : emptyStore;
}) as typeof usePersistedStore;


if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", usePersistedStore);
}
