import { ITag } from "~/types/user-types";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const prismaRouter = createTRPCRouter({
  getTagsByUser: publicProcedure.input(ITag).query(async ({ ctx, input }) => {
    const { userId } = input;

    const tags = await ctx.prisma?.tag.findMany({
      where: {
        userId: userId,
      },
    });

    return tags;
  }),
  createTag: publicProcedure
    .input(ITag.array())
    .mutation(async ({ ctx, input }) => {
      const tags = input;

      return await ctx.prisma?.tag.createMany({ data: tags });
    }),
});
