import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const spotifyUserRouter = createTRPCRouter({
  getUserBySpotifyId: protectedProcedure
    .input(
      z.object({
        spotifyId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const { spotifyId } = input;
     
      let user = await ctx.prisma.user.findFirst({
        where: {
          spotifyId: spotifyId
        }
      })
      if(!user) user =  await ctx.prisma.user.create({
        data: {
          spotifyId: spotifyId,
          image: ctx.session.user.image,
          name: ctx.session.user.name
        }
      })
      return user;
    }),
});
