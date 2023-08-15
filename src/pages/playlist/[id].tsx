import { getCookie } from "cookies-next";
import { type GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import MainLayout from "~/components/MainLayout";
import VirtualScroll from "~/components/ui/VirtualScroll";
import { SquareSkeleton } from "~/components/ui/skeletons/SquareSkeleton";
import { langKey } from "~/hooks/use-language";
import { ssgInit } from "~/server/ssg-init";
import { type Language, type PageWithLayout } from "~/types/page-types";
import { type Playlist, type Track } from "~/types/spotify-types";

const TrackRow = dynamic(() => import("~/components/ui/TrackRow"), {
  loading: () => <SquareSkeleton />,
});

interface props {
  data: Playlist;
}

const PlaylistPage: PageWithLayout = ({ data }: props) => {
  return (
    <>
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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  const language = getCookie(langKey, { req, res }) as Language;
  const session = await getSession({ req });
  const ssg = await ssgInit(session);

  const id = params?.id;
  let data: Playlist | undefined = undefined;
  if (id) {
    data = await ssg.spotify_playlist.getById.fetch({ id: id.toString() });
  }
  return {
    props: {
      data: data,
      //prettier- ignore
      ...(await serverSideTranslations(language ?? "en", [
        "playlists",
        "common",
        "modals",
      ])),
    },
  };
};
