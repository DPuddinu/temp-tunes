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
const TIMEOUT = 150;

export async function getUserPlaylists(
  accessToken: string,
  url: string | undefined = "/me/playlists?" + params.toString()
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

export async function getLibrary(
  accessToken: string,
  progressCallback: (progress: number, current: string) => void
) {
  //get playlists
  const playlists = await getUserPlaylists(accessToken);

  //populate playlists
  let i = 0;

  const interval = setInterval(() => {
    const playlist = playlists[i];
    if (playlist) {
      progressCallback(
        Math.floor((100 / playlists.length) * i + 1),
        playlist.name
      );
      getPlaylistTracks(playlist.id, accessToken)
        .then((tracks) => {
          playlist.tracks = tracks;
        })
        .catch((error) => console.error(error));
      i++;
    }
    if (i === playlists.length) {
      clearInterval(interval);
    }
  }, TIMEOUT);
  return playlists;
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
