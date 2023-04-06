import { create } from "zustand";
import type { Playlist, Track } from "~/types/spotify-types";
import { mountStoreDevtool } from 'simple-zustand-devtools';

interface BearState {
  playlists: Playlist[][];
  tracks: Track[]
  setPlaylists: (playlists: Playlist[][]) => void;
  setTracks: (tracks: Track[]) => void
}

export const useSpotifyStore = create<BearState>()((set) => ({
  playlists: [],
  tracks: [],
  setTracks: (tracks) => set((state) => ({ tracks: tracks })),
  setPlaylists: (playlists) => set((state) => ({ playlists: playlists })),
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", useSpotifyStore);
}