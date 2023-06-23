import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainLayout from "~/components/MainLayout";
import { usePlaylistStore, useStore } from "~/core/store";
import type { PageWithLayout } from "~/types/page-types";
import { type Playlist } from "~/types/spotify-types";
import { api } from "~/utils/api";

const PlaylistPage: PageWithLayout = () => {
  const { setMessage } = useStore();
  const [data, setData] = useState<Playlist>();
  const { isLoading, mutate } = api.spotify_playlist.getById.useMutation({
    onError() {
      setMessage(`Error: can't get playlist`);
    },
    onSuccess(data) {
      setData(data);
    },
  });

  const { playlists } = usePlaylistStore();
  const router = useRouter();

  useEffect(() => {
    if (playlists) {
      const temp = playlists.find(
        (playlist) => playlist.id === router.query.id?.toString()
      );
      if (temp) setData(temp);
    }
  }, [playlists, router.query.id]);

  useEffect(() => {
    if (!playlists && router.query.id)
      mutate({
        id: router.query.id.toString(),
      });
  }, [playlists, mutate, router]);

  return (
    <div className="p-2">
      <p className="text-lg font-semibold">{data?.name}</p>
      <p className="text-md font-semibold">{data?.owner?.display_name}</p>
      {data?.tracks &&
        data.tracks.map((track) => (
          <p key={track.id} className="p-2 text-lg font-semibold">
            {track.name}
          </p>
        ))}
    </div>
  );
};

export default PlaylistPage;
PlaylistPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;
