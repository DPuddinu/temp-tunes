import type { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import MainLayout from "~/components/MainLayout";
import { PlaylistPageSkeleton } from "~/components/ui/skeletons/PlaylistPageSkeleton";
import { type PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";
import { getPageProps } from "~/utils/helpers";

const PlaylistsPage: PageWithLayout = () => {
  const { data, isLoading } = api.spotify_playlist.getAll.useQuery(undefined, {
    refetchOnWindowFocus: true,
  });

  //prettier-ignore
  const PlaylistTable = dynamic(() => import("~/components/playlist/PlaylistTable"), {loading: () => <PlaylistPageSkeleton /> });
  
  return (
    <>
      {isLoading && <PlaylistPageSkeleton />}
      {data && <PlaylistTable data={data} />}
    </>
  );
};

export default PlaylistsPage;

PlaylistsPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getPageProps(["playlists", "common"], context);
};
