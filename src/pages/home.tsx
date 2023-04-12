import MainLayout from "@components/MainLayout";
import type { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";
import type { TimeRangeType } from "src/types/spotify-types";
import type { RecapPropsType } from "~/components/recap/UserTopCard";
import { Greetings } from "../components/Greetings";
import MoodCard from "../components/mood/MoodCard";
import RecommendedCard from "../components/recap/RecommendedCard";
import TopRatedCard from "../components/recap/UserTopCard";
import type { PageWithLayout } from "../types/page-types";

const Home: PageWithLayout = () => {
  const { data: sessionData } = useSession();

  // prettier-ignore
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeType>("short_term");

  return (
    <div className="h-full p-4">
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
