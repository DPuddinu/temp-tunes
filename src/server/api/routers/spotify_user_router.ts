import { z } from "zod";
import { spotifyGET } from "~/core/spotifyFetch";
import { averageMood } from "~/core/spotifyMoodAnalyze";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  TimeRangeEnum,
  TopTypeEnum,
  type AudioFeatures,
  type Recommendations,
  type TopArtists,
  type TopTracks
} from "~/types/spotify-types";
import { spliceArray } from "~/utils/helpers";

export const spotifyUserRouter = createTRPCRouter({
  getTopRated: publicProcedure
    .input(
      z.object({
        type: TopTypeEnum,
        timeRange: TimeRangeEnum,
        itemsPerPage: z.number(),
        totalItems: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { type, timeRange, itemsPerPage, totalItems } = input;
      const urlParams = new URLSearchParams({
        limit: totalItems.toString(),
        time_range: timeRange,
      });
      const url = `/me/top/${type}?${urlParams.toString()}`;
      
      // prettier-ignore
      const results = (await spotifyGET(url, ctx.session?.accessToken ?? '').then((res) => res.json())) as TopArtists | TopTracks;
      const itemsCount = results.items.length;

      const paginatedResults = spliceArray(results.items, itemsPerPage);

      return {
        items: paginatedResults,
        totalItems: itemsCount,
      };
    }),
  getMood: publicProcedure.query(async ({ ctx }) => {
    const tracksUrl = `/me/top/tracks`;
    // prettier-ignore
    const tracks = (await spotifyGET(
      tracksUrl,
      ctx.session?.accessToken ?? ""
    ).then((res) => res.json())) as TopTracks;
    const ids = tracks.items.map((track) => track.id);
    const moodUrl = `/audio-features?ids="${ids.join(",")}"`;

    // prettier-ignore
    const results = (await spotifyGET(moodUrl, ctx.session?.accessToken ?? "").then((res) => res.json())) as AudioFeatures;
    const analysis = results.audio_features;

    return averageMood(analysis);
  }),

  getRecommendedations: publicProcedure.query(async ({ ctx }) => {
    const tracksUrl = `/me/top/tracks`;
    const artistsUrl = `/me/top/artists`;

    // prettier-ignore
    const tracks = (await spotifyGET(
      tracksUrl,
      ctx.session?.accessToken ?? ""
    ).then((res) => res.json())) as TopTracks;

    // prettier-ignore
    const artists = (await spotifyGET(
      artistsUrl,
      ctx.session?.accessToken ?? ""
    ).then((res) => res.json())) as TopArtists;

    const baseUrl = `/recommendations`;
    const params = new URLSearchParams({
      seed_artists: `${artists.items[0]?.id ?? ""},${
        artists.items[1]?.id ?? ""
      }`,
      seed_tracks: `${tracks.items[0]?.id ?? ""},${tracks.items[1]?.id ?? ""}`,
      seed_genres: `${artists.items[0]?.genres[0] ?? ""}`,
      limit: "5",
    });
    let recommendations: Recommendations = {
      seeds: [],
      tracks: [],
    };

    if (tracks.items.length >= 2 && artists.items.length >= 2) {
      // prettier-ignore
      recommendations = await spotifyGET(`${baseUrl}?${params.toString()}`, ctx.session?.accessToken ?? "").then((res) => res.json()) as Recommendations;
    }
    return recommendations;
  }),
});


// INFINITE QUERY PROCEDURE
// getTop: publicProcedure
//     .input(
//       z.object({
//         type: TopTypeEnum,
//         timeRange: TimeRangeEnum,
//         cursor: z.string().nullish(),
//       })
//     )
//     .query(async ({ ctx, input }) => {
//       const { cursor, type, timeRange } = input;
//       const urlParams = new URLSearchParams({
//         limit: "50",
//         time_range: timeRange,
//       });
//       const baseUrl = `/me/top/${type}?${urlParams.toString()}`;
//       const params = cursor;

//       const url = cursor ? `${baseUrl}${params ?? ""}` : baseUrl;
//       // prettier-ignore
//       const results = (await spotifyGET(url, ctx.session?.accessToken ?? '').then((res) => res.json())) as TopArtists | TopTracks;
//       const nextCursor: typeof cursor = results.next
//         ? results.next.split(type)[1]
//         : undefined;

//       return {
//         items: results,
//         nextCursor,
//       };
//     }),