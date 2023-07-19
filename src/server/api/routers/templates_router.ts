import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TemplateEntrySchema, type TemplateSchemaEntryType } from "~/types/zod-schemas";

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
  editTemplate: protectedProcedure.input(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
      new_entries: TemplateEntrySchema.array(),
      old_entries: TemplateEntrySchema.array(),
    })
  )
    .mutation(async ({ ctx, input }) => {
      const { id, new_entries, name, description, old_entries } = input
      const updateEntries = await ctx.prisma.$transaction([
        // REMOVING ENTRIES
        ctx.prisma.templateEntry.deleteMany({
          where: {
            id: {
              in: old_entries.map((entry: TemplateSchemaEntryType) => entry.id ?? ''),
            },
          },
        }),
        ctx.prisma.playlistTemplate.update({
          where: {
            id: id
          },
          data: {
            description: description,
            name: name,
            templateEntries: {
              createMany: {
                data: new_entries.map(t => {
                  return {
                    entry: t.entry
                  }
                })
              }
            },
          }
        })
      ]);
      return await updateEntries
    }),
  getTemplateById: protectedProcedure.input(
    z.object({
      id: z.string(),
    })
  )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return ctx.prisma.playlistTemplate.findFirst({
        where: {
          userId: ctx.session.user.id,
          id: id
        },
        include: {
          templateEntries: true
        }
      })
    }),
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
