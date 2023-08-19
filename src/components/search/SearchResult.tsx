import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { spotifyGET } from "~/core/spotifyFetch";
import type {
  GetPlaylistResponseType,
  GetTracksResponseType,
  Playlist,
  Track,
} from "~/types/spotify-types";
import LoadingScreen from "../ui/LoadingPlaylistComponent";
import { getLibrary } from "~/core/spotifyCollection";
// import { getLibrary } from "~/core/spotifyCollection";

interface props {
  enabled: boolean;
  onFinish: (playlists: Playlist[]) => void;
}
const SearchResult = ({ enabled, onFinish }: props) => {
  const [loading, setLoading] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<string>();
  const [progress, setProgress] = useState<number>();

  const { data } = useSession();

  const {} = useQuery({
    queryFn: () => {
      setLoading(true);
      return getLibrary(
        data?.accessToken ?? "",
        (progress: number, current: string) => {
          setCurrentPlaylist(current);
          setProgress(progress);
        },
        (playlists: Playlist[]) => {
          setLoading(false);
          onFinish(playlists);
        }
      );
    },
    enabled: enabled && data?.accessToken !== undefined,
  });

  return (
    <>
      {loading && (
        <LoadingScreen current={currentPlaylist} progress={progress} />
      )}
    </>
  );
};

export default SearchResult;

// export async function getLibrary(
//   accessToken: string,
//   progressCallback: (progress: number, current: string) => void,
//   finishCallback: (playlists: Playlist[]) => void
// ) {
//   let batchesCount = 0;
//   let currentIndex = 0;

//   const playlists = await getUserPlaylists(accessToken);
//   const batches = [];
//   const chunkSize = Math.floor(playlists.length / 2);
//   for (let i = 0; i < playlists.length; i += chunkSize) {
//     batches.push(playlists.slice(i, i + chunkSize));
//   }
//   const total = playlists.length - 1;
//   while (batchesCount !== batches.length) {
//     const tempBatch = batches[batchesCount];
//     if (!tempBatch) break;
//     await loadTracks(0, tempBatch as Playlist[]);
//     batchesCount++;
//   }

//   return playlists;

//   async function loadTracks(index = 0, list: Playlist[]) {
//     const playlist = list[index];
//     if (!playlist) return;

//     progressCallback(
//       Math.floor((100 / (total + 1)) * (currentIndex + 1)),
//       playlist.name
//     );

//     playlist.tracks = await getPlaylistTracks(playlist.id, accessToken);
//     currentIndex++;

//     if (currentIndex === total) {
//       finishCallback(playlists);
//     } else {
//       loadTracks(index + 1, list);
//     }
//   }
// }

// const limitParams = new URLSearchParams({
//   limit: "50",
// });
// export async function getUserPlaylists(
//   accessToken: string,
//   url: string | undefined = "/me/playlists?" + limitParams.toString()
// ) {
//   let data: Playlist[] = [];
//   while (url) {
//     //prettier-ignore
//     const response = (await spotifyGET(url, accessToken).then((resp) => resp.json())) as GetPlaylistResponseType;
//     data = data.concat(
//       response.items.map((temp) => {
//         const tempPlaylist: Playlist = {
//           id: temp.id,
//           images: temp.images,
//           name: temp.name,
//           owner: { display_name: temp.owner.display_name, id: temp.owner.id },
//           tracks: [],
//           type: temp.type,
//           uri: temp.uri,
//         };
//         return tempPlaylist;
//       })
//     );
//     url = response.next?.split("v1")[1];
//   }
//   return data;
// }

// export async function getPlaylistTracks(
//   playlist_id: string,
//   accessToken: string,
//   url:
//     | string
//     | undefined = `/playlists/${playlist_id}/tracks?${limitParams.toString()}`
// ) {
//   let data: Track[] = [];

//   while (url) {
//     const response = (await spotifyGET(url, accessToken).then((resp) =>
//       resp.json()
//     )) as GetTracksResponseType;

//     const tracks = response.items
//       ? response.items.map((temp) => {
//           const track: Track = {
//             duration_ms: temp.track.duration_ms,
//             id: temp.track.id,
//             images: temp.track.images,
//             type: temp.track.type,
//             uri: temp.track.uri,
//             name: temp.track.name,
//             artists: temp.track.artists.map((artist) => {
//               return {
//                 genres: artist.genres,
//                 id: artist.id,
//                 name: artist.name,
//                 uri: artist.uri,
//                 images: artist.images,
//               };
//             }),
//           };
//           return track;
//         })
//       : [];
//     data = data.concat(tracks);
//     url = response.next ? `${response.next?.split("v1")[1]}` : undefined;
//   }
//   return data;
// }
