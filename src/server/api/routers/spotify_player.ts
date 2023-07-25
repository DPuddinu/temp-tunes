import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { addToQueue, getDevices, nextTrack, pause, play, previousTrack, transferPlaybackTo } from "~/core/spotifyCollection";
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
    paused: z.boolean().optional(),
    uris: z.string().array().nullish(),
    contextUri: z.string().nullish(),
    playbackState: z.boolean()
  }))
    .mutation(async ({ ctx, input }) => {
      const { uris, contextUri, paused = true, playbackState } = input;

      if (!playbackState) {
        const devices = await getDevices(ctx.session.accessToken);
        const webPlaybackSDK = devices.devices.filter((device: DeviceType) => device.name === 'Web Playback SDK')
        const transfer = await (transferPlaybackTo(ctx.session.accessToken, webPlaybackSDK[webPlaybackSDK.length - 1].id))
        return transfer
      }

      const _play = paused ? await play(ctx.session.accessToken, uris, contextUri) : await pause(ctx.session.accessToken)
      return _play
    }),
  getDevices: protectedProcedure.mutation(async ({ ctx }) => {
    return await getDevices(ctx.session.accessToken)
  }),
  addToQueue: protectedProcedure.input(z.object({ uri: z.string() })).mutation(async ({ ctx, input }) => {
    const { uri } = input;
    const addTo = await addToQueue(uri, ctx.session.accessToken)

    if (addTo.status !== 204) throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Could not add to queue, make sure player is playing"
    })
    return addTo
  }),

  nextTrack: protectedProcedure.mutation(async ({ ctx }) => {
    return await nextTrack(ctx.session.accessToken)
  }),
  previousTrack: protectedProcedure.mutation(async ({ ctx }) => {
    return await previousTrack(ctx.session.accessToken)
  }),
});
