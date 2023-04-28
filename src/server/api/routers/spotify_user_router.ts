import { z } from "zod";
import { getTracksByIds } from "~/core/spotifyCollection";
import { spotifyGET } from "~/core/spotifyFetch";
import { averageMood } from "~/core/spotifyMoodAnalyze";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  TimeRangeEnum,
  TopTypeEnum,
  type AudioFeatures,
  type Recommendations,
  type TopArtists,
  type TopTracks,
  type Track,
} from "~/types/spotify-types";
import { PlaylistSchema } from "~/types/zod-schemas";
import { spliceArray } from "~/utils/helpers";

export interface SearchResult {
  track: Track;
  playlist: string;
  creator: string;
  tags: string[];
}

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
      seed_artists: `${artists.items[0]?.id ?? ""},${
        artists.items[1]?.id ?? ""
      }`,
      seed_tracks: `${tracks.items[0]?.id ?? ""},${tracks.items[1]?.id ?? ""}`,
      seed_genres: `${artists.items[0] && artists.items[0].genres ?  artists.items[0]?.genres[0] : ""}`,
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
        playlists: PlaylistSchema.array().nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const matches: SearchResult[] = [];
      const tagMatches: SearchResult[] = [];
      const { query, playlists } = input;

      // SEARCH BY TAGS
      const filteredTags = await ctx.prisma.tag.findMany({
        where: {
          name: {
            contains: query,
          },
          OR: {
            spotifyTrackName: {
              contains: query
            }
          }
        },
      });
      console.log(filteredTags)
      
      const tracksByTags = await getTracksByIds(filteredTags.map(tag => tag.spotifyId), ctx.session.accessToken)
      filteredTags.forEach((tag) => {
        const trackByTag = tracksByTags.find(track => track.id === tag.spotifyId)
        if (trackByTag)
        tagMatches.push({
          tags: [tag.name],
          track: trackByTag,
          playlist: tag.spotifyPlaylistName ?? "",
          creator: ctx.session.user.name ?? '',
        });
      });
      matches.push(...tagMatches);
      // -----------------

      // SEARCH BY PLAYLIST

      if (playlists && playlists.length > 0) {
        playlists.forEach((playlist) => {
          const tracks = playlist.tracks;
          tracks.forEach((track) => {
            // MATCH BY TRACK NAME OR ARTIST NAME
            if (
              match(track.name, query) ||
              (match(
                track.artists.map((artist) => artist.name).join(),
                query
              ) &&
                !tagMatches.find(
                  (match) =>
                    match.playlist === playlist.name &&
                    match.track.name === track.name
                ))
            ) {
              matches.push({
                track: track,
                playlist: playlist.name,
                tags: [],
                creator: playlist.owner.display_name,
              });
            }
          });
        });
      }

      return matches;
    }),
});

function match(a: string, b: string): boolean {
  return a.toLowerCase().includes(b.toLowerCase());
}