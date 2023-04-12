import { z } from "zod";
import type { Playlist } from "~/types/spotify-types";
import { redis } from "../redis";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const redisRouter = createTRPCRouter({
  set: protectedProcedure
    .input(
      z.object({
        library: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { library } = input;
      if (!ctx?.session?.user?.id) {
        throw new TRPCError({
          message: "User not found!",
          code: "NOT_FOUND",
          cause: "Login failed",
        });
      }
      return await redis.set(ctx.session.user.id, library);
    }),
  get: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx?.session?.user?.id) {
      throw new TRPCError({
        message: "User not found!",
        code: "NOT_FOUND",
        cause: "Login failed",
      });
    }
    const data = await redis.get(ctx.session.user.id)
    return data? (JSON.parse(data) as Playlist[]) : [];
  }),
});
