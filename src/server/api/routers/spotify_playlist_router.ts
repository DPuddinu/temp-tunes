import { z } from "zod";
import { addTracksToPlaylist, createPlaylist, getPlaylistTracks, getUserPlaylists, removeTracksFromPlaylist, renamePlaylist, unfollowPlaylist } from "~/core/spotifyCollection";
import { type Playlist } from "~/types/spotify-types";
import { PlaylistSchema } from "~/types/zod-schemas";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const spotifyPlaylistRouter = createTRPCRouter({
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      const playlists = await getUserPlaylists(ctx.session.accessToken);
      return playlists;
    }),
  shuffle: protectedProcedure.input(
    z.object({
      playlist: PlaylistSchema,
    })
  )
    .mutation(async ({ ctx, input }) => {
      const { playlist } = input;
      const tracks = await getPlaylistTracks(playlist.id, ctx.session.accessToken)
      const uris = tracks.map(track => track.uri)
      await removeTracksFromPlaylist(uris, playlist.id, ctx.session.accessToken)
      const shuffledUris = shuffle(uris)
      console.log(shuffledUris)
      const add = await addTracksToPlaylist(shuffledUris, playlist.id, ctx.session.accessToken)
      console.log(shuffledUris)
      return add
    }),
  copy: protectedProcedure.input(z.object({
    playlist: PlaylistSchema,
  })).mutation(async ({ ctx, input }) => {
    const { playlist } = input;
    const create = await createPlaylist(ctx.session.user.id, playlist.name, ctx.session.accessToken).then((res) => res.json()) as Playlist
    const tracks = await getPlaylistTracks(playlist.id, ctx.session.accessToken)
    await addTracksToPlaylist(tracks.map(track => track.uri), create.id, ctx.session.accessToken)
    create.tracks = [...tracks]
    return create
  }),
  merge: protectedProcedure.input(z.object({
    originId: z.string(),
    originName: z.string(),
    destinationId: z.string(),
    destinationName: z.string(),
  })).mutation(async ({ ctx, input }) => {
    const { originId, destinationId } = input;
    const tracks = await getPlaylistTracks(originId, ctx.session.accessToken)
    const add = await addTracksToPlaylist(tracks.map(track => track.uri), destinationId, ctx.session.accessToken)
    return add
  }),
  unfollow: protectedProcedure.input(z.object({
    playlistID: z.string(),
  })).mutation(async ({ ctx, input }) => {
    const { playlistID } = input;
    const unfollow = await unfollowPlaylist(playlistID, ctx.session.accessToken)
    return unfollow
  }),
  rename: protectedProcedure.input(z.object({
    playlistID: z.string(),
    name: z.string()
  })).mutation(async ({ ctx, input }) => {
    const { playlistID, name } = input;
    const rename = await renamePlaylist(playlistID, name, ctx.session.accessToken)
    return rename
  })
});

function shuffle(array: unknown[]) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}