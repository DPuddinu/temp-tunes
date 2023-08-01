import { getCookie } from "cookies-next";
import { type GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import MainLayout from "~/components/MainLayout";
import VirtualScroll from "~/components/ui/VirtualScroll";
import { PlaylistSkeleton } from "~/components/ui/skeletons/PlaylistSkeleton";
import { SquareSkeleton } from "~/components/ui/skeletons/SquareSkeleton";
import { langKey } from "~/hooks/use-language";
import { useToast } from "~/hooks/use-toast";
import { type Language, type PageWithLayout } from "~/types/page-types";
import { type Track } from "~/types/spotify-types";
import { api } from "~/utils/api";

const TrackRow = dynamic(() => import("~/components/ui/TrackRow"), {
  loading: () => <SquareSkeleton />,
});

const PlaylistPage: PageWithLayout = () => {
  const { setMessage } = useToast();

  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const { isLoading, data } = api.spotify_playlist.getById.useQuery(
    {
      id: id,
    },
    {
      onError() {
        setMessage(`Error: can't get playlist`);
      },
      enabled: id !== null,
    }
  );

  return (
    <>
      {isLoading && <PlaylistSkeleton />}
      {data && (
        <div className="m-auto max-w-md rounded-xl bg-base-200 p-2 ">
          <div className="p-4">
            <h1 className="my-1 text-2xl font-semibold tracking-wider">
              {data?.name}
            </h1>
            <p className="ml-1 text-sm font-medium leading-4">
              {data?.owner.display_name}
            </p>
          </div>
          <VirtualScroll
            data={data.tracks}
            row={(virtualItem) => (
              <TrackRow track={data.tracks[virtualItem.index] as Track} />
            )}
          />
        </div>
      )}
    </>
  );
};

export default PlaylistPage;
PlaylistPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const language = getCookie(langKey, { req, res }) as Language;
  return {
    props: {
      //prettier- ignore
      ...(await serverSideTranslations(language, [
        "playlists",
        "common",
        "modals",
      ])),
    },
  };
};
