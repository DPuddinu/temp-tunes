import { z } from "zod";
import { spliceArray } from "~/utils/helpers";
import { spotifyGET } from "../../../core/spotifyFetch";
import type { GetPlaylistType, Playlist } from "../../../types/spotify-types";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const spotifyPlaylistRouter = createTRPCRouter({
  getAllPlaylists: publicProcedure
    .input(
      z.object({
        itemsPerPage: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { itemsPerPage } = input;
      const params = new URLSearchParams({
        limit: "50",
      });
      const url = "/me/playlists?" + params.toString();

      const testData = await fetchAllData(url, ctx.session?.accessToken ?? "");
      
      // console.log(allPlaylists.length);
      return spliceArray(testData, itemsPerPage);
    }),
});


async function fetchAllData(url: string | undefined, accessToken: string) {
  let data: Playlist[] = [];
  while (url) {
    //prettier-ignore
    const response = (await spotifyGET(url, accessToken).then((resp) => resp.json())) as GetPlaylistType;
    data = data.concat(response.items);
    url = response.next?.split("v1")[1];
  }
  return data;
}