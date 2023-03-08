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
  setTags: publicProcedure
    .input(
      z.object({
        userId: z.string().nullable(),
        tags: TagSchema.array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { tags, userId } = input;
      let tagsToAdd: Tag[] = [];
      let tagsToRemove: Tag[] = [];

      if (userId) {
        const oldTags = await ctx.prisma.tag.findMany({
          where: { userId: userId },
        });

        const sameTag = (a: Tag, b: Tag) => a.name === b.name;
        const onlyIn = (
          a: Tag[],
          b: Tag[],
          compareFunction: (a: Tag, b: Tag) => boolean
        ) =>
          a.filter(
            (leftValue) =>
              !b.some((rightValue) => compareFunction(leftValue, rightValue))
          );

        tagsToAdd = onlyIn(tags, oldTags, sameTag);
        tagsToRemove = onlyIn(oldTags, tags, sameTag);

        // ADDING NEW TAGS
        try {
          await ctx.prisma.tag.createMany({
            data: tagsToAdd,
          });
        } catch (e) {
          throw e;
        }
        
        // REMOVING DELETED TAGS
        try {
          await ctx.prisma.$transaction(
            tagsToRemove.map((tag) =>
              ctx.prisma.tag.delete({
                where: {
                  id: tag.id,
                },
              })
            )
          );
        } catch (e) {
          throw e;
        }
      }
      return {
        addedTags: tagsToAdd,
        removedTags: tagsToRemove,
      };
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
