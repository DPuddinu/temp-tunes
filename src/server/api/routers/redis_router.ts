import { z } from "zod";
import type { Playlist } from "~/types/spotify-types";
import { redis } from "../redis";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const redisRouter = createTRPCRouter({
  set: protectedProcedure
    .input(
      z.object({
        library: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { library } = input;
      return await redis.set(ctx.session.user.id, library);
    }),
  get: protectedProcedure.query(async ({ ctx }) => {
    const data = await redis.get(ctx.session.user.id)
    return data? (JSON.parse(data) as Playlist[]) : [];
  }),
});
