import { z } from "zod";
import { getDevices, getPlaybackState, pause, play, transferPlaybackTo } from "~/core/spotifyCollection";
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

  togglePlayPause: protectedProcedure.input(z.object({ paused: z.boolean().optional(), uris: z.string().array().nullish(), contextUri: z.string().nullish() })).mutation(async ({ ctx, input }) => {
    const { uris, contextUri, paused = true } = input;
    const playbackState = await getPlaybackState(ctx.session.accessToken);
    if (!playbackState) {
      const devices = await getDevices(ctx.session.accessToken);
      const webPlaybackSDK = devices.devices.filter((device: DeviceType) => device.name === 'Web Playback SDK')
      await (transferPlaybackTo(ctx.session.accessToken, webPlaybackSDK[webPlaybackSDK.length - 1].id))
    }
    const _play = paused ? await play(ctx.session.accessToken, uris, contextUri) : await pause(ctx.session.accessToken)
    return _play
  }),
  getDevices: protectedProcedure.mutation(async ({ ctx }) => {
    return await getDevices(ctx.session.accessToken)
  }),
  transferPlayback: protectedProcedure.input(z.object({ device_id: z.string() })).mutation(async ({ ctx, input }) => {
    const { device_id } = input;
    return await transferPlaybackTo(ctx.session.accessToken, device_id)
  }),
});
