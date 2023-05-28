import { z } from "zod";
import { addTracksToPlaylist, getUserPlaylists, removeTracksFromPlaylist } from "~/core/spotifyCollection";
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