import { type User } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUserBySpotifyId: protectedProcedure
    .query(async ({ ctx }) => {

      let user = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });
      if (!user)
        user = await ctx.prisma.user.create({
          data: {
            type: 'USER',
            image: ctx.session.user.image,
            name: ctx.session.user.name,
            email: ctx.session.user.email,
            id: ctx.session.user.id,
          } as User,
        });
      
      return { user: user };
    }),
});
