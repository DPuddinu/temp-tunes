import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TemplateEntrySchema } from "~/types/zod-schemas";

export const templatesRouter = createTRPCRouter({

  createTemplate: protectedProcedure.input(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      entries: TemplateEntrySchema.array()
    })
  )
    .mutation(async ({ ctx, input }) => {
      const { entries, name, description } = input
      if (!ctx.session.user.name) {
        throw new TRPCError({ message: "Username is required", code: "BAD_REQUEST" })
      }

      return await ctx.prisma.playlistTemplate.create({
        data: {
          stars: 0,
          userId: ctx.session.user.id,
          description: description,
          name: name,
          templateEntries: {
            createMany: {
              data: entries
            }
          },
        }
      })
    }),
  // editTemplate: protectedProcedure
  //   .query(async ({ ctx }) => {

  //     return
  //   }),
  // deleteTemplate: protectedProcedure
  //   .query(async ({ ctx }) => {

  //     return
  //   }),
  // voteTemplate: protectedProcedure
  //   .query(async ({ ctx }) => {

  //     return
  //   }),
  // searchTemplate: protectedProcedure
  //   .query(async ({ ctx }) => {

  //     return
  //   }),
  // getMostVotedTemplates: protectedProcedure
  //   .query(async ({ ctx }) => {

  //     return
  //   }),
  getCurrentUserTemplates: protectedProcedure
    .query(async ({ ctx }) => {

      return ctx.prisma.playlistTemplate.findMany({
        where: {
          userId: ctx.session.user.id
        },
        include: {
          templateEntries: true
        }
      })
    }),
  getTemplatesByUser: protectedProcedure.input(
    z.object({
      userId: z.string(),
    })
  )
    .query(async ({ ctx, input }) => {
      const { userId } = input;
      return ctx.prisma.playlistTemplate.findMany({
        where: {
          userId: userId
        }
      })
    }),
});
