import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const spotifySearchRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        search: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { search } = input;

      return search;
    }),
  
});
