import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TemplateEntrySchema } from "~/types/zod-schemas";

export const templatesRouter = createTRPCRouter({

  createTemplate: protectedProcedure.input(
    z.object({
      name: z.string(),
      entries: TemplateEntrySchema.array()
    })
  )
    .mutation(async ({ ctx, input }) => {
      const { entries, name } = input
      if (!ctx.session.user.name) {
        throw new TRPCError({ message: "Username is required", code: "BAD_REQUEST" })
      }
      
      return await ctx.prisma.playlistTemplate.create({
        data: {
          stars: 0,
          userId: ctx.session.user.id,
          name: name,
          templateEntries: {
            createMany: {
              data: entries
            }
          },
        }
      })
    }),
  editTemplate: protectedProcedure
    .query(async ({ ctx }) => {

      return
    }),
  deleteTemplate: protectedProcedure
    .query(async ({ ctx }) => {

      return
    }),
  voteTemplate: protectedProcedure
    .query(async ({ ctx }) => {

      return
    }),
  searchTemplate: protectedProcedure
    .query(async ({ ctx }) => {

      return
    }),
  getMostVotedTemplates: protectedProcedure
    .query(async ({ ctx }) => {

      return
    }),
  getTemplatesByUser: protectedProcedure
    .query(async ({ ctx }) => {

      return ctx.prisma.playlistTemplate.findMany({
        where: {
          userId: ctx.session.user.id
        }
      })
    }),
});
