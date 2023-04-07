import { spotifyGET } from "~/core/spotifyFetch";
import type {
  GetPlaylistResponseType,
  GetTracksResponseType,
  Playlist,
  Track,
} from "~/types/spotify-types";
const params = new URLSearchParams({
  limit: "50",
});
const playlistsEndPoint = "/me/playlists?" + params.toString();

export async function getUserPlaylists(
  accessToken: string,
  url: string | undefined = playlistsEndPoint
) {
  let data: Playlist[] = [];
  while (url) {
    //prettier-ignore
    const response = (await spotifyGET(url, accessToken).then((resp) => resp.json()).catch(error => console.error(error))) as GetPlaylistResponseType;
    data = data.concat(response.items);
    url = response.next?.split("v1")[1];
  }
  return data;
}

export async function getLibrary(playlist_ids: string[], accessToken: string) {
  // const tracks
}


export async function getPlaylistTracks(
  playlist_id: string,
  accessToken: string,
  url: string | undefined = "/playlists/" + playlist_id + "/tracks"
) {
  let data: Track[] = [];
  while (url) {
    const response = (await spotifyGET(url, accessToken)
      .then((resp) => resp.json())
      .catch((error) => console.error(error))) as GetTracksResponseType;
    data = data.concat(response.items);
    url = response.next?.split("v1")[1];
  }
  return data;
}
