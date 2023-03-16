import MainLayout from "@components/MainLayout";
import Recap from "@components/recap/Recap";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";
import type {
  Mood,
  Playlist,
  Recommendations,
  TimeRangeType,
  TopArtists,
  TopTracks,
} from "src/types/spotify-types";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { authOptions } from "~/server/auth";
import { Greetings } from "../components/Greetings";
import type { NextPageWithLayout } from "../types/page-types";

interface HomeProps {
  recommendations: Recommendations;
  topArtists: TopArtists[][];
  topTracks: TopTracks[][];
  playlists: Playlist[][];
  mood: Mood;
}

const Home: NextPageWithLayout = (props: any) => {
  const { data: sessionData } = useSession();
  console.log(props);
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

  // const recommendations = await ssg.spotify_user.getRecommendedations.fetch();
  // const mood = await ssg.spotify_user.getMood.fetch();
  // const topTracks = await ssg.spotify_user.getTopRated.fetch({
  //   itemsPerPage: 5,
  //   timeRange: "short_term",
  //   type: "tracks",
  //   totalItems: 50,
  // });
  // const topArtists = await ssg.spotify_user.getTopRated.fetch({
  //   itemsPerPage: 5,
  //   timeRange: "short_term",
  //   type: "artists",
  //   totalItems: 50,
  // });
  const playlists = await ssg.spotify_playlist.getAllPlaylists.fetch({
    itemsPerPage: 50,
  });
  const data = {
    playlists,
  };
  return {
    props: {
      data: data,
      ...(await serverSideTranslations(context.locale ?? "en", [
        "home",
        "common",
        "modals",
      ])),
    },
  };
};
