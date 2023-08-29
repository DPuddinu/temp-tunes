import { z } from "zod";
import { getTracksByIds, search, type searchQueryType } from "~/core/spotifyCollection";
import { spotifyGET } from "~/core/spotifyFetch";
import { averageMood } from "~/core/spotifyMoodAnalyze";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  TimeRangeEnum,
  TopTypeEnum,
  type AudioFeatures,
  type Recommendations,
  type TopArtists,
  type TopTracks
} from "~/types/spotify-types";
import { PlaylistSchema, SearchTypeEnum, type TagSchemaType } from "~/types/zod-schemas";
import { spliceArray } from "~/utils/helpers";
import { createTagsObject } from "./tags_router";


export type TagSearchType = {
  title: string;
  artists: string;
  tags?: string;
}
export type TrackSearchType = {
  title: string;
  artists: string;
  playlist?: string;
  creator?: string;
}
export type SearchResult = TrackSearchType | TagSearchType

export const spotifyUserRouter = createTRPCRouter({
  getTopRated: protectedProcedure
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
      const results = (await spotifyGET(url, ctx.session.accessToken).then((res) => res.json())) as TopArtists | TopTracks;
      const itemsCount = results.items.length;

      const paginatedResults = spliceArray(results.items, itemsPerPage);

      return {
        items: paginatedResults,
        totalItems: itemsCount,
      };
    }),
  getMood: protectedProcedure.query(async ({ ctx }) => {
    const tracksUrl = `/me/top/tracks`;
    // prettier-ignore
    const tracks = (await spotifyGET(
      tracksUrl,
      ctx.session.accessToken
    ).then((res) => res.json())) as TopTracks;
    const ids = tracks.items.map((track) => track.id);
    const moodUrl = `/audio-features?ids="${ids.join(",")}"`;

    // prettier-ignore
    const results = (await spotifyGET(moodUrl, ctx.session.accessToken).then((res) => res.json())) as AudioFeatures;
    const analysis = results.audio_features;

    return averageMood(analysis);
  }),

  getRecommendedations: protectedProcedure.query(async ({ ctx }) => {
    const tracksUrl = `/me/top/tracks`;
    const artistsUrl = `/me/top/artists`;

    // prettier-ignore
    const tracks = (await spotifyGET(
      tracksUrl,
      ctx.session.accessToken
    ).then((res) => res.json())) as TopTracks;

    // prettier-ignore
    const artists = (await spotifyGET(artistsUrl, ctx.session.accessToken).then(
      (res) => res.json()
    )) as TopArtists;

    const params = new URLSearchParams({
      seed_artists: `${artists.items[0]?.id ?? ""},${artists.items[1]?.id ?? ""
        }`,
      seed_tracks: `${tracks.items[0]?.id ?? ""},${tracks.items[1]?.id ?? ""}`,
      seed_genres: `${artists.items[0] && artists.items[0].genres ? artists.items[0]?.genres[0] : ""}`,
      limit: "5",
    });
    const recommendationsUrl = `/recommendations?${params.toString()}`;
    let recommendations: Recommendations = {
      seeds: [],
      tracks: [],
    };

    if (tracks.items.length >= 2 && artists.items.length >= 2) {
      // prettier-ignore
      recommendations = (await spotifyGET(
        recommendationsUrl,
        ctx.session.accessToken
      ).then((res) => res.json())) as Recommendations;
    }
    return recommendations;
  }),
  searchTracks: protectedProcedure
    .input(
      z.object({
        query: z.string(),
        playlists: PlaylistSchema.array().nullish().optional(),
        type: SearchTypeEnum
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { query, playlists, type } = input

      switch (type) {
        case "tag": {
          const tagMatches: TagSearchType[] = [];
          // SEARCH BY TAGS
          const tagsByName = await ctx.prisma.tag.findMany({
            where: {
              userId: {
                equals: ctx.session.user.id
              },
              name: {
                contains: query
              }
            }
          }) as TagSchemaType[];

          const tagsObject = createTagsObject(tagsByName)

          const tracksByTags = await getTracksByIds(tagsByName.map(tag => tag.spotifyId), ctx.session.accessToken)
          tracksByTags.forEach(t => {
            if (t.id) {
              tagMatches.push({
                title: t.name,
                artists: t.artists.map(artist => artist.name).join(', '),
                tags: tagsObject[t.id]?.map(x => x.name).join(', ')
              })
            }
          })
          return tagMatches
        }
        case "track": {
          const playlistMatches: TrackSearchType[] = [];
          if (playlists && playlists.length > 0 && type === "track") {
            playlists.forEach((playlist) => {
              const tracks = playlist.tracks;

              tracks.forEach((track) => {

                // MATCH BY TRACK NAME OR ARTIST NAME
                // prettier-ignore
                if (match(track.name, query) || match(track.artists.map((artist) => artist.name).join(), query)) {
                  const newMatch: TrackSearchType = {
                    title: track.name,
                    artists: track.artists.map(artist => artist.name).join(', '),
                    playlist: playlist.name,
                    creator: playlist.owner.display_name,
                  }
                  playlistMatches.push(newMatch);
                }
              });
            });
          }
          return playlistMatches
        }
      }
    }),
  search: protectedProcedure.input(
    z.object({
      query: z.string(),
    })
  ).query(async ({ ctx, input }) => {
    const { query } = input;
    const searchTrack = await search(query, ctx.session.accessToken) as searchQueryType;
    return searchTrack.tracks.items
  }),
});

function match(a: string, b: string): boolean {
  return a.toLowerCase().includes(b.toLowerCase());
}