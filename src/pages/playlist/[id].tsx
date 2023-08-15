import { type GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import MainLayout from "~/components/MainLayout";
import VirtualScroll from "~/components/ui/VirtualScroll";
import { PlaylistSkeleton } from "~/components/ui/skeletons/PlaylistSkeleton";
import { SquareSkeleton } from "~/components/ui/skeletons/SquareSkeleton";
import { useToast } from "~/hooks/use-toast";
import { type PageWithLayout } from "~/types/page-types";
import { type Track } from "~/types/spotify-types";
import { api } from "~/utils/api";
import { getPageProps } from "~/utils/helpers";

const TrackRow = dynamic(() => import("~/components/ui/TrackRow"), {
  loading: () => <SquareSkeleton />,
});

const PlaylistPage: PageWithLayout = () => {
  const { setMessage } = useToast();
  const { t } = useTranslation("common");

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { isLoading, data } = api.spotify_playlist.getById.useQuery(
    {
      id: id,
    },
    {
      onError() {
        setMessage(t('error'));
      },
      enabled: id !== null,
    }
  );

  return (
    <>
      {isLoading && <PlaylistSkeleton />}
      {data && (
        <div className="m-auto flex h-full max-h-[36rem] max-w-md flex-col rounded-xl bg-base-200 p-2 ">
          <div className="p-4">
            <h1 className="my-1 text-2xl font-semibold tracking-wider">
              {data?.name}
            </h1>
            <p className="ml-1 text-sm font-medium leading-4">
              {data?.owner.display_name}
            </p>
          </div>
          <div className="grow">
            <VirtualScroll
              height="100%"
              data={data.tracks}
              row={(virtualItem) => (
                <TrackRow track={data.tracks[virtualItem.index] as Track} />
              )}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PlaylistPage;
PlaylistPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return getPageProps(["playlists", "common", "modals"], { req, res });
};
