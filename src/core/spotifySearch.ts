import type { TagsObject } from "~/server/api/routers/prisma_router";
import type { Playlist, Track } from "~/types/spotify-types";
import type { TagSchemaType } from "~/types/user-types";

type SearchResultType = "track" | "playlist";

interface SearchResult {
  type: SearchResultType;
  name: string;
  tagName?: string;
}
export function executeSearch(query: string, playlists: Playlist[], tags: TagsObject) {
  const matches: SearchResult[] = [];

  //search by tag
  if (tags) {
    for (const key in tags) {
      const tagsBySpotifyId = tags[key];
      if (tagsBySpotifyId) {
        tagsBySpotifyId.forEach((tag) => {
          if (tag.name.toLowerCase().includes(query.toLowerCase())) {
            matches.push({
              name: tag.spotifyName,
              tagName: tag.name,
              type: tag.spotifyType,
            });
          }
        });
      }
    }
  }

  //search by trackname

  //search by artist

  return matches;
}
