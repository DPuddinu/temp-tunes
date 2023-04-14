import type { Tag } from "@prisma/client";
import { z } from "zod";
import { TagSchema, type TagSchemaType } from "~/types/user-types";
import { createTRPCRouter, protectedProcedure } from "../trpc";
export interface TagsObject {
  [z: string]: TagSchemaType[];
}
export const prismaRouter = createTRPCRouter({
  getTagsByUser: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;
      const userTags = await ctx.prisma?.tag.findMany({
        where: {
          userId: userId,
        },
      });
      const tags = userTags as TagSchemaType[];
      const tagsObject = createTagsObject(tags);
      return tagsObject;
    }),
  setTags: protectedProcedure
    .input(
      z.object({
        userId: z.string().nullable(),
        tags: TagSchema.array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { tags: userTags, userId } = input;
      let tagsToAdd: Tag[] = [];
      let tagsToRemove: Tag[] = [];

      const tags = userTags as Tag[];
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
function createTagsObject(tags: TagSchemaType[]) {
  const tagsObject: TagsObject = {};
  tags.forEach((tag: TagSchemaType) => {
    if (!tagsObject[tag.spotifyId]) {
      tagsObject[tag.spotifyId] = [tag];
    } else {
      tagsObject[tag.spotifyId]?.push(tag);
    }
  });
  return tagsObject;
}
