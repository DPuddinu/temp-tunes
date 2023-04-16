import { spotifyGET } from "~/core/spotifyFetch";
import type {
  GetPlaylistResponseType,
  GetTracksResponseType,
  Playlist,
  Track,
} from "~/types/spotify-types";

const limitParams = new URLSearchParams({
  limit: "50",
});
const TIMEOUT = 150;

export async function getUserPlaylists(
  accessToken: string,
  url: string | undefined = "/me/playlists?" + limitParams.toString()
) {
  let data: Playlist[] = [];
  while (url) {
    //prettier-ignore
    const response = (await spotifyGET(url, accessToken).then((resp) => resp.json()).catch(error => console.error(error))) as GetPlaylistResponseType;
    data = data.concat(
      response.items.map((temp) => {
        const tempPlaylist: Playlist = {
          id: temp.id,
          images: temp.images,
          name: temp.name,
          owner: { display_name: temp.owner.display_name },
          tracks: [],
          type: temp.type,
          uri: temp.uri,
        };
        return tempPlaylist;
      })
    );
    url = response.next?.split("v1")[1];
  }
  return data;
}

export async function getLibrary(
  accessToken: string,
  progressCallback: (progress: number, current: string) => void,
  finishCallback: (playlists: Playlist[]) => void
) {
  //get playlists
  const playlists = await getUserPlaylists(accessToken);

  //populate playlists
  let i = 0;

  const interval = setInterval(() => {
    const playlist = playlists[i];
    if (playlist) {
      progressCallback(
        Math.floor((100 / playlists.length) * (i + 1)),
        playlist.name
      );
      getPlaylistTracks(playlist.id, accessToken)
        .then((tracks) => {
          playlist.tracks = tracks;
          i++;
        })
        .catch((error) => console.error(error));
    }
    if (i === playlists.length) {
      clearInterval(interval);
      finishCallback(playlists);
    }
  }, TIMEOUT);
  return playlists;
}

// interface GetPlaylistTracksReturnType {

// }
// const filterTracksByField =
//   "fields=items(track(name,artists,album(name),duration_ms,id,type,images))";

export async function getPlaylistTracks(
  playlist_id: string,
  accessToken: string,
  url:
    | string
    | undefined = `/playlists/${playlist_id}/tracks?${limitParams.toString()}`
) {
  let data: Track[] = [];

  while (url) {
    const response = (await spotifyGET(url, accessToken)
      .then((resp) => resp.json())
      .catch((error) => console.error(error))) as GetTracksResponseType;
    const tracks = response.items.map((temp) => {
      const track: Track = {
        duration_ms: temp.track.duration_ms,
        id: temp.track.id,
        images: temp.track.images,
        type: temp.track.type,
        uri: temp.track.uri,
        name: temp.track.name,
        artists: temp.track.artists.map((artist) => {
          return {
            genres: artist.genres,
            id: artist.id,
            name: artist.name,
            uri: artist.uri,
            images: artist.images,
          };
        }),
      };
      return track;
    });
    data = data.concat(tracks);
    url = response.next ? `${response.next?.split("v1")[1]}` : undefined;
  }
  return data;
}
