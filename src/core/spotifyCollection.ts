import { spotifyDELETE, spotifyGET, spotifyPOST } from "~/core/spotifyFetch";
import type {
  Artist,
  GetPlaylistResponseType,
  GetTracksResponseType,
  Playlist,
  Track,
} from "~/types/spotify-types";
import { spliceArray } from "~/utils/helpers";

const limitParams = new URLSearchParams({
  limit: "50",
});

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
          owner: { display_name: temp.owner.display_name, id: temp.owner.id },
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

  await loadTracks();
  return playlists;

  async function loadTracks(index = 0) {
    const playlist = playlists[index];

    if (playlist) {
      progressCallback(
        Math.floor((100 / playlists.length) * (index + 1)),
        playlist.name
      );

      playlist.tracks = await getPlaylistTracks(playlist.id, accessToken);
      if (index === playlists.length - 1) {
        finishCallback(playlists);
      } else {
        loadTracks(index + 1);
      }
    }
  }
}

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

    const tracks = response.items
      ? response.items.map((temp) => {
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
        })
      : [];
    data = data.concat(tracks);
    url = response.next ? `${response.next?.split("v1")[1]}` : undefined;
  }
  return data;
}

export async function getTracksByIds(
  ids: string[],
  accessToken: string
) {
  const data: Track[] = [];
  const chunks = spliceArray(ids, 50)
  let i = 0;

  while(i !== chunks.length) {
    const chunk = chunks[i]
    const formattedIds = chunk?.join(',')
    const tracksUrl = `/tracks?ids=${formattedIds}` 

    const tracksByTags = await spotifyGET(tracksUrl, accessToken).then(res => res.json());
    const formattedTracks: Track[] = tracksByTags.tracks.map((track: Track) => {
      const formattedTrack: Track = {
        artists: track.artists.map((artist: Artist) => {
          const formattedArtist: Artist = {
            genres: artist.genres,
            id: artist.id,
            images: artist.images,
            name: artist.name,
            uri: artist.uri
          }
          return formattedArtist
        }),
        duration_ms: track.duration_ms,
        name: track.name,
        type: track.type,
        uri: track.uri,
        id: track.id,
      }
      return formattedTrack
    })
    data.push(...formattedTracks)
    i++;
  }
  return data;
}

export async function removeTracksFromPlaylist(uris: string[], playlistId: string, token: string) {
  const url = `/playlists/${playlistId}/tracks`
  const body = {
    tracks: uris.map(uri => {
      return {
        uri: uri
      }
    })
  }
  
  const response = await spotifyDELETE({access_token: token, url: url, body: JSON.stringify(body) })
  return response
}

export async function addTracksToPlaylist(uris: string[], playlistId: string, token: string) {

  const url = `/playlists/${playlistId}/tracks`
  const chunks = spliceArray(uris, 100)
  let i = 0;

  const responses = []
  while (i !== chunks.length) {
    const chunk = chunks[i] as string[]
    const body = {
      uris: chunk ?? [],
      position: i == 0 ? 0 : chunk.length -1
    }
    responses.push(spotifyPOST({ access_token: token, url: url, body: JSON.stringify(body) }))
    
    i++
  }
  return await Promise.all(responses)
}

export async function createPlaylist(userID: string, name: string, access_token: string){
  const url = `/users/${userID}/playlists`
  const body = {
    name: name
  }
  return await spotifyPOST({access_token: access_token, url, body: JSON.stringify(body)})
}

export async function unfollowPlaylist(playlistId: string, access_token: string) {
  const url = `/playlists/${playlistId}/followers`
  return await spotifyDELETE({ access_token: access_token, url })
}