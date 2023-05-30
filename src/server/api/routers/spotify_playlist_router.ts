import { z } from "zod";
import { addTracksToPlaylist, createPlaylist, getPlaylistTracks, getUserPlaylists, removeTracksFromPlaylist, unfollowPlaylist } from "~/core/spotifyCollection";
import { Playlist } from "~/types/spotify-types";
import { PlaylistSchema } from "~/types/zod-schemas";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const spotifyPlaylistRouter = createTRPCRouter({
  getAllPlaylists: protectedProcedure
    .query(async ({ ctx }) => {
      const playlists = await getUserPlaylists(ctx.session.accessToken);
      return playlists;
    }),
  randomizePlaylist: protectedProcedure.input(
    z.object({
      playlist: PlaylistSchema,
    })
  )
    .mutation(async ({ ctx, input }) => {
      const { playlist } = input;
      let uris = playlist.tracks.map(track => track.uri)
      await removeTracksFromPlaylist(uris, playlist.id, ctx.session.accessToken)
      
      const add = await addTracksToPlaylist(shuffle(uris), playlist.id, ctx.session.accessToken)

      return add
    }),
  copyPlaylist: protectedProcedure.input(z.object({
    playlist: PlaylistSchema,
  })).mutation(async ({ ctx, input }) => {
    const { playlist } = input;
    const create = await createPlaylist(ctx.session.user.id, playlist.name, ctx.session.accessToken).then((res) => res.json()) as Playlist
    const tracks = await getPlaylistTracks(playlist.id, ctx.session.accessToken)
    const add = await addTracksToPlaylist(tracks.map(track => track.uri), create.id, ctx.session.accessToken)
    create.tracks = [...tracks]
    return create
  }),
  mergePlaylist: protectedProcedure.input(z.object({
    origin: PlaylistSchema,
    destinationId: z.string()
  })).mutation(async ({ ctx, input }) => {
    const { origin, destinationId } = input;
    const tracks = await getPlaylistTracks(origin.id, ctx.session.accessToken)
    const add = await addTracksToPlaylist(tracks.map(track => track.uri), destinationId, ctx.session.accessToken)
    return add
  }),
  unfollowPlaylist: protectedProcedure.input(z.object({
    playlistID: z.string(),
  })).mutation(async ({ ctx, input }) => {
    const { playlistID } = input;
    const unfollow = await unfollowPlaylist(playlistID, ctx.session.accessToken)
    return unfollow
  })
});

function shuffle(array: any[]) {
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