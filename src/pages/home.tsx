import MainLayout from "@components/MainLayout";
import Recap from "@components/recap/Recap";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import type {
  Playlist,
  TimeRangeType
} from "src/types/spotify-types";
import superjson from "superjson";
import { useSpotifyStore } from "~/core/store";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { authOptions } from "~/server/auth";
import { Greetings } from "../components/Greetings";
import type { NextPageWithLayout, PageWithLayout } from "../types/page-types";
interface Props{
  userPlaylists: Playlist[][]
}
const Home: PageWithLayout = ({ userPlaylists }: Props) => {
  const { data: sessionData } = useSession();
  const { playlists, setPlaylists } = useSpotifyStore();

  useEffect(() => {
    if (userPlaylists && playlists.length === 0) setPlaylists(userPlaylists);
  }, []);

  // prettier-ignore
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeType>("short_term");

  return (
    <div className="p-4">
      <Greetings
        key={"greetings"}
        name={sessionData?.user?.name || ""}
        timeRange={selectedTimeRange}
        selectTimeRange={setSelectedTimeRange}
      />
      <Recap key={"recap"} timeRange={selectedTimeRange} />
    </div>
  );
};

Home.getLayout = (page) => <MainLayout>{page}</MainLayout>;
export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createInnerTRPCContext({ session: session }),
    transformer: superjson,
  });

  //prettier- ignore
  const playlists = await ssg.spotify_playlist.getAllPlaylists.fetch({itemsPerPage: 50});
  const data = { playlists};
  return {
    props: {
      userPlaylists: data,
      //prettier- ignore
      ...(await serverSideTranslations(context.locale ?? "en", ["home","common","modals"])),
    },
  };
};
