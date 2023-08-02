import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import MainLayout from "~/components/MainLayout";
import { PlaylistPageSkeleton } from "~/components/ui/skeletons/PlaylistPageSkeleton";
import { langKey } from "~/hooks/use-language";
import { type Language, type PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";

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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const language = getCookie(langKey, { req, res }) as Language;
  return {
    props: {
      //prettier- ignore
      ...(await serverSideTranslations(language ?? "en", [
        "playlists",
        "common",
      ])),
    },
  };
};
