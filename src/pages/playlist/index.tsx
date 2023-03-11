import { api } from "~/utils/api"

const PlaylistsPage = () => {
  const {data, isLoading, isError} = api.spotify_playlist.getAllPlaylists.useQuery({itemsPerPage: 20});

  return (
    <div>index</div>
  )
}

export default PlaylistsPage