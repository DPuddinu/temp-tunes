import { z } from "zod";
import { spotifyGET } from "../../../core/spotifyFetch";
import type {
  GetPlaylistType
} from "../../../types/spotify-types";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const spotifyPlaylistRouter = createTRPCRouter({
  getAllPlaylists: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor } = input;

      const baseUrl = "/me/playlists";
      const params = cursor;

      const url = cursor ? `${baseUrl}${params?? ''}` : baseUrl;
      const results = await (await spotifyGET(url, ctx.session?.accessToken ?? '')).json() as GetPlaylistType;

      const nextCursor: typeof cursor = results.next
        ? results.next.split("playlists")[1]
        : undefined;

      return {
        items: results.items,
        nextCursor,
      }
    }),
});
