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

  setTagsByTrack: protectedProcedure.input(
    z.object({
      trackId: z.string(),
      tags: TagSchema.array(),
    })
  ).mutation(async ({ ctx, input }) => {
    const { tags, trackId } = input;

    const operations = await ctx.prisma.$transaction([
      // REMOVING TAGS
      ctx.prisma.tag.deleteMany({
        where: {
          spotifyId: trackId,
          userId: ctx.session.user.id
        },
      }),
      // ADDING TAGS
      ctx.prisma.tag.createMany({
        data: tags.map((tag) => {
          const temp = {
            ...tag,
            userId: ctx.session.user.id,
          };
          return temp;
        }),
      }),
    ]);

    return operations
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
