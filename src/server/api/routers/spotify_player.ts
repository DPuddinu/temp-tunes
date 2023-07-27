import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { addToQueue, getDevices, getPlaybackState, nextTrack, pause, play, previousTrack, transferPlaybackTo } from "~/core/spotifyCollection";
import { createTRPCRouter, protectedProcedure } from "../trpc";

interface DeviceType {
  id: string,
  is_active: boolean,
  is_private_session: boolean,
  is_restricted: boolean,
  name: string,
  type: string,
  volume_percent: number
}
export const spotifyPlayerRouter = createTRPCRouter({

  togglePlayPause: protectedProcedure.input(z.object({
    uris: z.string().array().nullish(),
    contextUri: z.string().nullish(),
  }))
    .mutation(async ({ ctx, input }) => {
      const { uris, contextUri } = input;

      const playbackState = await getPlaybackState(ctx.session.accessToken)
      if (!playbackState) {
        const devices = await getDevices(ctx.session.accessToken);
        const webPlaybackSDK = devices.devices.find((device: DeviceType) => device.name === 'Web Playback SDK')
        const transfer = await (transferPlaybackTo(ctx.session.accessToken, webPlaybackSDK.id))
      }
      return await play(ctx.session.accessToken, uris, contextUri)
    }),
  getDevices: protectedProcedure.mutation(async ({ ctx }) => {
    return await getDevices(ctx.session.accessToken)
  }),
  addToQueue: protectedProcedure.input(z.object({ uri: z.string() })).mutation(async ({ ctx, input }) => {
    const { uri } = input;
    const addTo = await addToQueue(uri, ctx.session.accessToken)

    if (addTo.status === 401) throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Token expired"
    })
    if (addTo.status === 403) throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Bad OAauth request"
    })
    if (addTo.status === 429) throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Rate limit exceeded"
    })
    return addTo
  }),

});
