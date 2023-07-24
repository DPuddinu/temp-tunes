import { type User } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import type { TagSchemaType } from "~/types/zod-schemas";
import { createTagsObject } from "./tags_router";

export const userRouter = createTRPCRouter({
  getUserBySpotifyId: protectedProcedure
    .query(async ({ ctx }) => {

      let user = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });
      if (!user)
        user = await ctx.prisma.user.create({
          data: {
            type: 'USER',
            image: ctx.session.user.image,
            name: ctx.session.user.name,
            email: ctx.session.user.email,
            id: ctx.session.user.id,
          } as User,
        });
      const tags = await ctx.prisma.tag.findMany({
        where: {
          userId: user.id,
        },
      }) as TagSchemaType[];
      return { user: user, tags: createTagsObject(tags) };
    }),
});
