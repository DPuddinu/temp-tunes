import { type User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createTagsObject } from "./prisma_router";
import { TagSchemaType } from "~/types/zod-schemas";

export const userRouter = createTRPCRouter({
  getUserBySpotifyId: protectedProcedure
    .input(
      z.object({
        spotifyId: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { spotifyId } = input;

      if (!spotifyId)
        throw new TRPCError({
          message: "Can't find user if spotifyId is undefined",
          code: "BAD_REQUEST",
        });
      let user = await ctx.prisma.user.findFirst({
        where: {
          id: spotifyId,
        },
      });
      if (!user)
        user = await ctx.prisma.user.create({
          data: {
            image: ctx.session.user.image,
            name: ctx.session.user.name,
            email: ctx.session.user.email,
            id: spotifyId,
          } as User,
        });
      // const tags = ctx.prisma.tag.findMany({
      //   where: {
      //     userId: user.id,
      //   },
      // }) as TagSchemaType[]; 
      return { user: user };
    }),
});
