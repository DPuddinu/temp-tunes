import MainLayout from "@components/MainLayout";
import type { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";
import type { TimeRangeType } from "src/types/spotify-types";
import { TimeRangeArray } from "src/types/spotify-types";
import MoodCard from "~/components/recap/cards/MoodCard";
import RecommendedCard from "~/components/recap/cards/RecommendedCard";
import type { RecapPropsType } from "~/components/recap/cards/UserTopCard";
import TopRatedCard from "../components/recap/cards/UserTopCard";
import type { PageWithLayout } from "../types/page-types";

type GreetingsProps = {
  name: string | undefined | null;
  timeRange: TimeRangeType;
  selectTimeRange: (range: TimeRangeType) => void;
};

const Home: PageWithLayout = () => {
  const { data: sessionData } = useSession();
  // prettier-ignore
  const [timeRange, setTimeRange] = useState<TimeRangeType>("short_term");

  return (
    <section className="h-full p-4">
      <Greetings
        name={sessionData?.user?.name}
        timeRange={timeRange}
        selectTimeRange={setTimeRange}
      />
      <Recap timeRange={timeRange} />
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

function Greetings({ name, timeRange, selectTimeRange }: GreetingsProps) {
  const { t } = useTranslation("home");

  return (
    <div className="">
      <div className="p-2">
        <div className="flex flex-col sm:flex-row">
          <h1 className="text-2xl font-bold text-base-content md:text-3xl">
            {`${salute()},`}&nbsp;
          </h1>
          <h1 className="text-2xl font-bold text-base-content md:text-3xl">{`${name} 👋🏻`}</h1>
        </div>
        <p className="mt-2 font-medium text-base-content">{t("recap.title")}</p>
        <select
          className="select select-sm mt-4 bg-base-300"
          value={timeRange}
          onChange={(e) => selectTimeRange(e.target.value as TimeRangeType)}
        >
          {TimeRangeArray.map((range, i) => (
            <option className="mt-1 p-1" key={i} value={range}>
              {t(range)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  function salute() {
    const hours = new Date().getHours();
    if (hours >= 0 && hours <= 12) return t("morning");
    if (hours >= 13 && hours <= 17) return t("afternoon");
    if (hours >= 18 && hours <= 22) return t("evening");
    return t("night");
  }
}

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
