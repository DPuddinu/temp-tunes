import { useEffect, useState } from "react";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { TagsObject } from "~/server/api/routers/prisma_router";
import type { Playlist } from "~/types/spotify-types";

type UserLibraryState = {
  playlists: Playlist[];
  tags: TagsObject;
  firstLoading: boolean;
  setPlaylists: (playlists: Playlist[]) => void;
  setTags: (tags: TagsObject) => void;
  setFirstLoading: (firstLoading: boolean) => void;
};


export const emptyStore = {
  playlists: [],
  tags: {},
  firstLoading: true,
  setPlaylists: (playlists: Playlist[]) => {
    return;
  },
  setTags: (tags: TagsObject) => {
    return;
  },
  setFirstLoading: (firstLoading: boolean) => {
    return;
  },
};
export const usePersistedStore = create<UserLibraryState>()(
  persist(
    (set) => ({
      playlists: [],
      tags: {},
      firstLoading: true,
      setTags: (tags) => set(() => ({ tags: tags })),
      setPlaylists: (playlists) => set(() => ({ playlists: playlists })),
      setFirstLoading: (firstLoading) => set(() => ({ firstLoading: firstLoading })),
    }),
    {
      name: "asm-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export const useStore = ((selector, compare) => {
  /*
  This a fix to ensure zustand never hydrates the store before React hydrates the page.
  Without this, there is a mismatch between SSR/SSG and client side on first draw which produces
  an error.
   */
  const store = usePersistedStore(selector, compare);
  const [isHydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return isHydrated ? store : selector(emptyStore);
}) as typeof usePersistedStore;

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", usePersistedStore);
}
