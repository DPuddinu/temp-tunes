import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TemplateEntrySchema, TemplateFilterTypeEnum, type TemplateSchemaEntryType } from "~/types/zod-schemas";

export const templatesRouter = createTRPCRouter({
  create: protectedProcedure.input(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      entries: z.string().min(3).array()
    })
  )
    .mutation(async ({ ctx, input }) => {
      const { entries, name, description } = input
      if (!ctx.session.user.name) {
        throw new TRPCError({ message: "Username is required", code: "BAD_REQUEST" })
      }

      return await ctx.prisma.template.create({
        data: {
          type: 'CUSTOM',
          userId: ctx.session.user.id,
          public: true,
          userName: ctx.session.user.name,
          description: description,
          name: name,
          templateEntries: {
            createMany: {
              data: entries.map(t => {
                return {
                  entry: t
                }
              })
            }
          },
        },
        include: {
          templateEntries: true
        }
      })
    }),
  edit: protectedProcedure.input(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().optional(),
      new_entries: z
        .object({
          templateId: z.string().optional(),
          entry: z.string().min(3),
        }).array(),
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
              in: old_entries.map((entry: TemplateSchemaEntryType) => entry.id),
            },
          },
        }),
        ctx.prisma.template.update({
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
  getById: protectedProcedure.input(
    z.object({
      id: z.number(),
    })
  )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return ctx.prisma.template.findFirst({
        where: {
          userId: ctx.session.user.id,
          id: id
        },
        include: {
          templateEntries: true
        }
      })
    }),
  importById: protectedProcedure.input(
    z.object({
      id: z.number(),
    })
  )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.template.update({
        where: {
          id: id
        },
        data: {
          author: {
            connect: {
              id: ctx.session.user.id
            }
          }
        },
        include: {
          templateEntries: true
        }
      })
    }),
  getByCurrentUser: protectedProcedure.input(
    z.object({
      limit: z.number().min(1).max(100).nullish(),
      skip: z.number().optional(),
      cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
    })
  )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50
      const { cursor, skip } = input;

      const items = await ctx.prisma.template.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: 'asc',
        },
        where: {
          OR: [
            {
              author: {
                some: {
                  id: ctx.session.user.id
                }
              },
            },
            {
              userId: ctx.session.user.id
            }
          ]
        },
        include: {
          templateEntries: true
        }
      })
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        if (nextItem)
          nextCursor = nextItem.id;
      }
      return {
        items,
        nextCursor,
      };
    }),
  getByUser: protectedProcedure.input(
    z.object({
      userId: z.string(),
    })
  )
    .query(async ({ ctx, input }) => {
      const { userId } = input;
      return ctx.prisma.template.findMany({
        where: {
          userId: userId
        }
      })
    }),
  delete: protectedProcedure.input(
    z.object({ id: z.number(), entries: z.number().array() })
  ).mutation(async ({ ctx, input }) => {

    const { id, entries } = input;
    const deleteEntries = await ctx.prisma.$transaction([
      // REMOVING ENTRIES
      ctx.prisma.templateEntry.deleteMany({
        where: {
          id: {
            in: entries,
          },
        },
      }),
      ctx.prisma.template.delete({
        where: {
          id: id
        },
      })
    ]);
    return await deleteEntries
  }),
  getExplore: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.template.findMany({
      where: {
        type: 'EXPLORE'
      },
      include: {
        templateEntries: true
      }
    })
  }),
  getLatest: protectedProcedure.input(
    z.object({
      filter: z.object({
        value: z.string(),
        type: TemplateFilterTypeEnum
      }).nullish(),
      limit: z.number().min(1).max(100).nullish(),
      skip: z.number().optional(),
      cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
    }),
  ).query(async ({ ctx, input }) => {

    const limit = input.limit ?? 50
    const { cursor, skip, filter } = input;

    const items = await ctx.prisma.template.findMany({
      take: limit + 1,
      skip: skip,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        id: 'asc',
      },
      where: {
        userId: {
          not: {
            equals: ctx.session.user.id
          }
        },
        name: {
          contains: filter?.type === "name" ? filter?.value : undefined
        },
        userName: {
          contains: filter?.type === "author" ? filter?.value : undefined
        }
      },
      include: {
        templateEntries: true
      },
    })
    let nextCursor: typeof cursor | undefined = undefined;
    if (items.length > limit) {
      const nextItem = items.pop();
      if (nextItem)
        nextCursor = nextItem.id;
    }
    return {
      items,
      nextCursor,
    };
  }),
});
