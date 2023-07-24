import type { Tag } from "@prisma/client";
import { z } from "zod";
import {
  TagSchema,
  type TagSchemaType,
} from "~/types/zod-schemas";
import { createTRPCRouter, protectedProcedure } from "../trpc";
export interface TagsObject {
  [z: string]: TagSchemaType[];
}

export const tagsRouter = createTRPCRouter({
  getTagsByUser: protectedProcedure.query(async ({ ctx }) => {
    const userTags = await ctx.prisma.tag.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    const tags = userTags as TagSchemaType[];
    const tagsObject = createTagsObject(tags);
    return tagsObject;
  }),
  setTags: protectedProcedure
    .input(
      z.object({
        addTags: TagSchema.array(),
        removeTags: TagSchema.array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { addTags, removeTags } = input;
      let tagsToAdd: Tag[] = [];
      let tagsToRemove: Tag[] = [];
      const oldTags = await ctx.prisma.tag.findMany({
        where: { userId: ctx.session.user.id },
      });

      const sameTag = (a: TagSchemaType, b: TagSchemaType) => a.id === b.id;
      const filterTagsToAdd = (
        a: TagSchemaType[],
        b: TagSchemaType[],
        compareFunction: (a: TagSchemaType, b: TagSchemaType) => boolean
      ) => a.filter((left) => !b.some((right) => compareFunction(left, right)));
      const filterTagsToRemove = (
        a: TagSchemaType[],
        b: TagSchemaType[],
        compareFunction: (a: TagSchemaType, b: TagSchemaType) => boolean
      ) => a.filter((left) => b.some((right) => compareFunction(left, right)));
      tagsToAdd = filterTagsToAdd(addTags, oldTags, sameTag) as Tag[];
      tagsToRemove = filterTagsToRemove(removeTags, oldTags, sameTag) as Tag[];
      console.log("ADDING ---> ", tagsToAdd);
      console.log("--------------------");
      console.log("REMOVING ---> ", tagsToRemove);

      await ctx.prisma.$transaction([
        // ADDING TAGS
        ctx.prisma.tag.createMany({
          data: tagsToAdd.map((tag) => {
            const temp = {
              ...tag,
              userId: ctx.session.user.id,
            };
            return temp;
          }),
        }),
        // REMOVING TAGS
        ctx.prisma.tag.deleteMany({
          where: {
            id: {
              in: tagsToRemove.map((tag) => tag.id),
            },
          },
        }),
      ]);
      const newTags = (await ctx.prisma.tag.findMany({
        where: { userId: ctx.session.user.id },
      })) as TagSchemaType[];
      return createTagsObject(newTags);
    }),
  getTagsByTrack: protectedProcedure.input(
    z.object({
      trackId: z.string()
    })
  ).query(async ({ ctx, input }) => {

    const { trackId } = input;

    const trackTags = await ctx.prisma.tag.findMany({
      where: {
        userId: ctx.session.user.id,
        spotifyId: trackId,
      },
    });
    return trackTags
  }),

  orderTagsByName: protectedProcedure.query(async ({ ctx }) => {
    const trackTags = await ctx.prisma.tag.groupBy({
      where: {
        userId: ctx.session.user.id,
      },
      _count: {
        name: true
      },
      by: ["name"],
      orderBy: {
        _count: {
          name: 'desc'
        }
      },
      take: 5
    });
    return trackTags
  }),
});
export function createTagsObject(tags: TagSchemaType[]) {
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
