import type { TagsObject } from "~/server/api/routers/prisma_router";
import type { Playlist } from "~/types/spotify-types";

type SearchResultType = "track" | "playlist" | "tag";

export interface SearchResult {
  type: SearchResultType;
  name: string;
  tagName?: string;
}
export function executeSearch(
  query: string,
  playlists: Playlist[],
  tags: TagsObject
) {
  const matches: SearchResult[] = [];

  //search by tag
  if (tags) {
      Object.keys(tags).forEach((key) => {
      const tagsBySpotifyId = tags[key];
      if (tagsBySpotifyId) {
        tagsBySpotifyId.forEach((tag) => {
          if (tag.name.toLowerCase().includes(query.toLowerCase())) {
            matches.push({
              name: tag.spotifyName,
              tagName: tag.name,
              type: 'tag',
            });
          }
        });
      }
    });
  }

  //search by trackname

  //search by artist
  console.log(matches);
  return matches;
}
