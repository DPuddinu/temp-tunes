import { spotifyDELETE, spotifyGET, spotifyPOST, spotifyPUT } from "~/core/spotifyFetch";
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

  let batchesCount = 0
  let currentIndex = 0;

  const playlists = await getUserPlaylists(accessToken);
  const batches = [];
  const chunkSize = Math.floor(playlists.length / 2);
  for (let i = 0; i < playlists.length; i += chunkSize) {
    batches.push(playlists.slice(i, i + chunkSize))
  }
  const total = playlists.length - 1
  while (batchesCount !== batches.length) {

    const tempBatch = batches[batchesCount]
    if (!tempBatch) break
    await loadTracks(0, tempBatch as Playlist[])
    batchesCount++
  }

  return playlists;

  async function loadTracks(index = 0, list: Playlist[]) {

    const playlist = list[index];
    if (!playlist) return;

    progressCallback(
      Math.floor((100 / (total + 1)) * (currentIndex + 1)),
      playlist.name
    );

    playlist.tracks = await getPlaylistTracks(playlist.id, accessToken);
    currentIndex++

    if (currentIndex === total) {
      finishCallback(playlists);
    } else {
      loadTracks(index + 1, list);
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

  while (i !== chunks.length) {
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

  const response = await spotifyDELETE({ access_token: token, url: url, body: JSON.stringify(body) })
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
      position: i == 0 ? 0 : chunk.length - 1
    }
    responses.push(spotifyPOST({ access_token: token, url: url, body: JSON.stringify(body) }))

    i++
  }
  return await Promise.all(responses)
}

export async function createPlaylist(userID: string, name: string, access_token: string) {
  const url = `/users/${userID}/playlists`
  const body = {
    name: name
  }
  return await spotifyPOST({ access_token: access_token, url, body: JSON.stringify(body) })
}

export async function unfollowPlaylist(playlistId: string, access_token: string) {
  const url = `/playlists/${playlistId}/followers`
  return await spotifyDELETE({ access_token: access_token, url })
}

export async function renamePlaylist(playlistId: string, name: string, access_token: string) {
  const url = `/playlists/${playlistId}`
  const body = {
    name: name
  }
  return await spotifyPUT({ access_token: access_token, url, body: JSON.stringify(body) })
}

interface getPlaylistByIdTrackType {
  track: {
    track: Track
  }
}
export async function getPlaylistById(playlistId: string, access_token: string) {
  const url = `/playlists/${playlistId}`
  const playlist = (await spotifyGET(url, access_token).then((resp) => resp.json()).catch((error) => console.error(error)));
  const tracks = [...playlist.tracks.items.map((t: getPlaylistByIdTrackType) => t.track)] as Track[];
  if (playlist.tracks.next) {
    const res = await (getPlaylistTracks(playlistId, access_token, playlist.tracks.next?.split("v1")[1]))
    tracks.push(...res)
  }
  playlist.tracks = tracks
  return playlist
}

export async function getDevices(access_token: string) {
  return (await spotifyGET('/me/player/devices', access_token).then((resp) => resp.json()).catch((error) => console.error(error)));
}

export async function getPlaybackState(access_token: string) {
  return (await spotifyGET('/me/player', access_token).then((resp) => resp.json()).catch((error) => console.error(error)));
}

export async function transferPlaybackTo(access_token: string, device_id: string) {
  const body = {
    device_ids: [device_id],
  }
  return await spotifyPUT({ url: '/me/player', access_token: access_token, body: JSON.stringify(body) })
}

export async function addToQueue(uri: string, access_token: string) {
  const params = new URLSearchParams({
    uri: uri,
  });
  return await spotifyPOST({ url: `/me/player/queue?${params.toString()}`, access_token: access_token })
}
type PlayProps = {
  uris?: string[];
  contextUri?: string
}
export async function play(access_token: string, uris?: string[] | undefined | null, contextUri?: string | undefined | null) {
  const body: PlayProps = {}
  if (uris) body.uris = uris
  if (contextUri) body.contextUri = contextUri
  return await spotifyPUT({ url: '/me/player/play', access_token: access_token, body: JSON.stringify(body) })
}

export async function addToPlaylist(uris: string[], playlistId: string, access_token: string) {
  const body = {
    uris
  }
  return await spotifyPOST({ url: `/playlists/${playlistId}/tracks`, access_token: access_token, body: JSON.stringify(body) })
}

export type searchQueryType = {
  tracks: {
    items: Track[]
  }
}
export async function search(q: string, access_token: string) {
  const params = new URLSearchParams({
    q: `${q}`,
    type: "track",
    limit: "10"
  });
  return await spotifyGET(`/search?${params.toString()}`, access_token).then((resp) => resp.json()).catch((error) => console.error(error));
}