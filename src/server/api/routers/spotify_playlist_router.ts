import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getUserPlaylists } from "~/core/spotifyCollection";
import { spliceArray } from "~/utils/helpers";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const spotifyPlaylistRouter = createTRPCRouter({
  getAllPlaylists: protectedProcedure
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
      const data = await getUserPlaylists(url, ctx.session.accessToken);

      return spliceArray(data, itemsPerPage);
    }),
});
