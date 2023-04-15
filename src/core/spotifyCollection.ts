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
    data = data.concat(response.items);
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
  const fullPlaylists = await getUserPlaylists(accessToken);
  const playlists = fullPlaylists.map((temp) => {
    const tempPlaylist: Playlist = {
      id: temp.id,
      images: temp.images,
      name: temp.name,
      owner: temp.owner,
      tracks: temp.tracks,
      type: temp.type,
      uri: temp.uri,
    }
    return tempPlaylist;
  });
  //populate playlists
  let i = 0;

  const interval = setInterval(() => {
    const playlist = playlists[i];
    if (playlist) {
      i++;
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
      return {
        artists: temp.track.artists,
        duration_ms: temp.track.duration_ms,
        id: temp.track.id,
        images: temp.track.images,
        name: temp.track.name,
        type: temp.track.type,
        uri: temp.track.uri,
      };
    });
    data = data.concat(tracks);
    url = response.next ? `${response.next?.split("v1")[1]}` : undefined;
  }
  return data;
}
