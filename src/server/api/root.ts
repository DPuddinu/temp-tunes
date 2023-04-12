import { createTRPCRouter } from "~/server/api/trpc";
import { prismaRouter } from "./routers/prisma_router";
import { spotifyPlaylistRouter } from "./routers/spotify_playlist_router";
import { spotifyUserRouter } from "./routers/spotify_user_router";
import { redisRouter } from "./routers/redis_router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  spotify_playlist: spotifyPlaylistRouter,
  spotify_user: spotifyUserRouter,
  prisma_router: prismaRouter,
  redis_router: redisRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
