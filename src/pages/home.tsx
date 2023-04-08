import MainLayout from "@components/MainLayout";
import { useQuery } from "@tanstack/react-query";
import type { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import type { TimeRangeType } from "src/types/spotify-types";
import type { RecapPropsType } from "~/components/recap/UserTopCard";
import { useSpotifyStore } from "~/core/store";
import { api } from "~/utils/api";
import { Greetings } from "../components/Greetings";
import MoodCard from "../components/mood/MoodCard";
import RecommendedCard from "../components/recap/RecommendedCard";
import TopRatedCard from "../components/recap/UserTopCard";
import type { PageWithLayout } from "../types/page-types";
import { getLibrary } from "./api/spotifyApi/spotifyCollection";

interface LoadingStateProps {
  progress: number;
  current: string;
}

const Home: PageWithLayout = () => {
  const { data: sessionData } = useSession();
  const {
    playlists,
    setPlaylists,
    tags,
    setTags,
    firstLoading,
    setFirstLoading,
  } = useSpotifyStore();
  const [currentPlaylist, setCurrentPlaylist] = useState("");
  const [progress, setProgress] = useState<number>(0);

  const {
    data: library,
    isLoading: loadingLibrary,
    isError: errorLibrary,
  } = useQuery({
    queryKey: ["library"],
    queryFn: () =>
      getLibrary(
        sessionData?.accessToken ?? "",
        (progress: number, current: string) => {
          setCurrentPlaylist(current);
          setProgress(progress);
        },
        () => setFirstLoading(false)
      ),
    enabled: !!sessionData?.accessToken && firstLoading,
  });

  const { data: userTags } = api.prisma_router.getTagsByUser.useQuery({
    userId: sessionData?.user?.id ?? "",
  });

  // STORING PLAYLISTS
  useEffect(() => {
    if (library && playlists.length === 0) {
      setPlaylists(library);
    }
  }, [playlists.length, setPlaylists, library]);

  // STORING TAGS
  useEffect(() => {
    if (userTags && Object.keys(tags).length === 0) {
      setTags(userTags);
    }
  }, [setTags, tags, userTags]);

  // prettier-ignore
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeType>("short_term");

  return (
    <div className="h-full p-4">
      {firstLoading ? (
        <LoadingScreen progress={progress} current={currentPlaylist} />
      ) : (
        <>
          <Greetings
            key={"greetings"}
            name={sessionData?.user?.name || ""}
            timeRange={selectedTimeRange}
            selectTimeRange={setSelectedTimeRange}
          />
          <Recap key={"recap"} timeRange={selectedTimeRange} />
        </>
      )}
    </div>
  );
};

const LoadingScreen = ({ progress, current }: LoadingStateProps) => {
  return (
    <section className="flex flex-col items-center justify-center gap-3">
      <p>Loading your playlists...</p>
      <p className="text-sm">{current}</p>
      <progress
        className="progress progress-primary w-56"
        value={progress}
        max="100"
      ></progress>
    </section>
  );
};
const Recap = ({ timeRange = "short_term" }: RecapPropsType) => {
  return (
    <section className="md:grid md:grid-cols-3 md:gap-3">
      <TopRatedCard timeRange={timeRange} />
      <MoodCard />
      <RecommendedCard />
    </section>
  );
};

Home.getLayout = (page) => <MainLayout>{page}</MainLayout>;
export default Home;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      //prettier- ignore
      ...(await serverSideTranslations(locale ?? "en", [
        "home",
        "common",
        "modals",
      ])),
    },
  };
};
