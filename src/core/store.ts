import { create } from "zustand";
import type { Playlist } from "~/types/spotify-types";
import { mountStoreDevtool } from 'simple-zustand-devtools';

interface BearState {
  playlists: Playlist[][];
  setPlaylists: (playlists: Playlist[][]) => void;
}

export const useSpotifyStore = create<BearState>()((set) => ({
  playlists: [],
  setPlaylists: (playlists) => set((state) => ({ playlists: playlists })),
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", useSpotifyStore);
}