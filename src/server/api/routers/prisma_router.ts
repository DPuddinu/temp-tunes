import type { Tag } from "@prisma/client";
import { z } from "zod";
import { TagSchema } from "~/types/user-types";
import { createTRPCRouter, publicProcedure } from "../trpc";
export interface TagsObject {
  [z: string]: Tag[];
}
export const prismaRouter = createTRPCRouter({
  getTagsByUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = input;

      const tags = await ctx.prisma?.tag.findMany({
        where: {
          userId: userId,
        },
      });
      const tagsObject = createTagsObject(tags);
      return tagsObject;
    }),
  createTags: publicProcedure
    .input(TagSchema.array())
    .mutation(async ({ ctx, input }) => {
      const tags = input;

      return await ctx.prisma?.tag.createMany({ data: tags });
    }),
});
function createTagsObject(tags: Tag[]) {
  const tagsObject: TagsObject = {};
  tags.forEach((tag: Tag) => {
    if (!tagsObject[tag.spotifyId]) {
      tagsObject[tag.spotifyId] = [tag];
    } else {
      tagsObject[tag.spotifyId]?.push(tag);
    }
  });
  return tagsObject;
}
