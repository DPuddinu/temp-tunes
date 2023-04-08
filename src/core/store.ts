import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import type { TagsObject } from "~/server/api/routers/prisma_router";
import type { Playlist } from "~/types/spotify-types";
interface UserLibraryState {
  playlists: Playlist[];
  tags: TagsObject;
  firstLoading: boolean;
  setPlaylists: (playlists: Playlist[]) => void;
  setTags: (tags: TagsObject) => void;
  setFirstLoading: (firstLoading: boolean) => void;
}

export const useSpotifyStore = create<UserLibraryState>()((set) => ({
  playlists: [],
  tags: {},
  firstLoading: true,
  setTags: (tags) => set(() => ({ tags: tags })),
  setPlaylists: (playlists) => set(() => ({ playlists: playlists })),
  setFirstLoading: (firstLoading) => set(() => ({ firstLoading: firstLoading })),
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", useSpotifyStore);
}
