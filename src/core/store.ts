import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
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

export const useStore = create<UserLibrary & UserLibraryActions>()((set) => ({
  playlists: [],
  tags: {},
  setTags: (tags) => set(() => ({ tags: tags })),
  setPlaylists: (playlists) => set(() => ({ playlists: playlists })),
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", useStore);
}
