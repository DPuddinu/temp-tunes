import { type GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import MainLayout from "~/components/ui/layouts/MainLayout";
import { PlaylistSkeleton } from "~/components/ui/skeletons/PlaylistSkeleton";
import { SquareSkeleton } from "~/components/ui/skeletons/SquareSkeleton";
import { useToast } from "~/hooks/use-toast";
import { type PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";
import { getPageProps } from "~/utils/helpers";

const PlaylistDetails = dynamic(
  () => import("~/components/playlist/PlaylistDetails"),
  {
    loading: () => <SquareSkeleton />,
  }
);

const PlaylistPage: PageWithLayout = () => {
  const { setMessage } = useToast();
  const { t } = useTranslation("common");

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { isLoading, data } = api.spotify_playlist.getById.useQuery(
    { id: id },
    {
      onError() {
        setMessage(t("error"));
      },
      enabled: id !== null,
    }
  );

  return (
    <>
      {isLoading && <PlaylistSkeleton />}
      {data && <PlaylistDetails data={data} />}
    </>
  );
};

export default PlaylistPage;
PlaylistPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getPageProps(["playlists", "common", "modals"], context);
};
