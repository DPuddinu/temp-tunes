import type { TagsObject } from "~/server/api/routers/prisma_router";
import type { Artist, Playlist } from "~/types/spotify-types";

type SearchResultType = "track" | "playlist" | "tag";

export interface SearchResult {
  name: string;
  playlist: string;
  artists: Artist[];
  tags: string[];
}
export function executeSearch(
  query: string,
  playlists: Playlist[],
  tags: TagsObject
) {
  const matches: SearchResult[] = [];

  //search by tag
  // if (tags) {
  //     Object.keys(tags).forEach((key) => {
  //     const tagsBySpotifyId = tags[key];
  //     if (tagsBySpotifyId) {
  //       tagsBySpotifyId.forEach((tag) => {
  //         if (match(tag.name, query)) {
  //           matches.push({
  //             name: tag.spotifyName,
  //             playlist: '',
  //             tags: [...tagsBySpotifyId.map(tag => tag.name)],
  //             artists: []
  //           });
  //         }
  //       });
  //     }
  //   });
  // }

  //search by trackname
  // playlists.forEach(playlist => {
  //   const tracks = playlist.tracks;
  //   tracks.forEach(track => {
  //     if(match(track.name, query)){
  //       matches.push({
  //         name: track.name,
  //         type: "track",
  //       });
  //     }
  //   })
  // })
  //search by artist
  console.log(matches);
  return matches;
}

function match(a: string, b: string): boolean {
  return a.toLowerCase().includes(b.toLowerCase());
}