import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import MainLayout from "~/components/MainLayout";
import { PlaylistPageSkeleton } from "~/components/ui/skeletons/PlaylistPageSkeleton";
import type { Language } from "~/core/settingsStore";
import { langKey } from "~/hooks/use-language";
import { type PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";

const PlaylistsPage: PageWithLayout = () => {
  const { data, isLoading } = api.spotify_playlist.getAll.useQuery(undefined, {
    refetchOnWindowFocus: true,
  });

  //prettier-ignore
  const PlaylistTable = dynamic(() => import("~/components/ui/playlist/PlaylistTable"), {loading: () => <PlaylistPageSkeleton /> });

  return (
    <div className="flex h-full w-full flex-col items-center ">
      {isLoading && <PlaylistPageSkeleton />}
      {data && <PlaylistTable data={data} />}
    </div>
  );
};

export default PlaylistsPage;

PlaylistsPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const language = getCookie(langKey, { req, res }) as Language;
  return {
    props: {
      //prettier- ignore
      ...(await serverSideTranslations(language, ["playlists", "common"])),
    },
  };
};
