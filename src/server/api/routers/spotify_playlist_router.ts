import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getUserPlaylists } from "~/pages/api/spotifyApi/spotifyCollection";
import { spliceArray } from "~/utils/helpers";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const spotifyPlaylistRouter = createTRPCRouter({
  getAllPlaylists: publicProcedure
    .input(
      z.object({
        itemsPerPage: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { itemsPerPage } = input;
      const params = new URLSearchParams({
        limit: "50",
      });
      const url = "/me/playlists?" + params.toString();

      if (!ctx?.session?.accessToken) {
        throw new TRPCError({
          message: "AccessToken not found!",
          code: "NOT_FOUND",
          cause: "Login failed",
        });
      }
      const data = await getUserPlaylists(url, ctx.session.accessToken);

      return spliceArray(data, itemsPerPage);
    }),
});
