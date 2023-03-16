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
      const userPlaylists: Playlist[] = [];

      //prettier-ignore
      const allPlaylists = await fetchAllPlaylists(
        userPlaylists,
        url,
        ctx.session?.accessToken ?? ""
      );
      // console.log(userPlaylists.length);
      // console.log(allPlaylists.length);
      return spliceArray(userPlaylists, itemsPerPage);
    }),
});

//prettier-ignore
async function fetchAllPlaylists(playlists: Playlist[], url: string, accessToken: string): Promise<Playlist[]> {
 
  //prettier-ignore
  const temp = (await spotifyGET(url, accessToken).then((resp) => resp.json())) as GetPlaylistType;

  playlists.push(...temp.items);
  const nextPage = temp.next?.split("v1")[1];
  
  if (nextPage) {
    await fetchAllPlaylists(playlists, nextPage, accessToken);
    
  } else {
    
    return playlists
  }
  
  return playlists;
}