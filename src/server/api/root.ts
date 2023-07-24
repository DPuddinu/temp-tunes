import { createTRPCRouter } from "~/server/api/trpc";
import { spotifyPlayerRouter } from "./routers/spotify_player";
import { spotifyPlaylistRouter } from "./routers/spotify_playlist_router";
import { spotifyUserRouter } from "./routers/spotify_user_router";
import { tagsRouter } from "./routers/tags_router";
import { templatesRouter } from "./routers/templates_router";
import { userRouter } from "./routers/user_router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  spotify_playlist: spotifyPlaylistRouter,
  spotify_user: spotifyUserRouter,
  tags: tagsRouter,
  user: userRouter,
  template: templatesRouter,
  player: spotifyPlayerRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
