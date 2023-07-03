import { z } from "zod";
import { getDevices, getPlaybackState, play, transferPlaybackTo } from "~/core/spotifyCollection";
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

  play: protectedProcedure.input(z.object({ uris: z.string().array().nullish(), contextUri: z.string().nullish() })).mutation(async ({ ctx, input }) => {
    const playbackState = await getPlaybackState(ctx.session.accessToken);
    if (!playbackState) {
      const devices = await getDevices(ctx.session.accessToken);
      const webPlaybackSDK = devices.devices.filter((device: DeviceType) => device.name === 'Web Playback SDK')
      const transfer = await (transferPlaybackTo(ctx.session.accessToken, webPlaybackSDK[webPlaybackSDK.length - 1].id))
      return transfer
    }
    const { uris, contextUri } = input;

    return await play(ctx.session.accessToken, uris, contextUri)
  }),
  getDevices: protectedProcedure.mutation(async ({ ctx }) => {
    return await getDevices(ctx.session.accessToken)
  }),
  transferPlayback: protectedProcedure.input(z.object({ device_id: z.string() })).mutation(async ({ ctx, input }) => {
    const { device_id } = input;
    return await transferPlaybackTo(ctx.session.accessToken, device_id)
  }),
});
