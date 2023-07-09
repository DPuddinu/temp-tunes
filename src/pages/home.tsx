import MainLayout from "@components/MainLayout";
import { useIntersection, useOs } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { TimeRangeType } from "src/types/spotify-types";
import type { RecapPropsType } from "~/components/recap/cards/UserTopCard";
import { RecapSkeleton } from "~/components/ui/skeletons/RecapSkeleton";
import type { Language } from "~/core/settingsStore";
import { langKey } from "~/hooks/use-language";
import type { PageWithLayout } from "../types/page-types";

const Home: PageWithLayout = () => {
  const { data: sessionData } = useSession();
  // prettier-ignore
  const [timeRange, setTimeRange] = useState<TimeRangeType>("short_term");

  return (
    <section>
      {sessionData?.user?.name ? (
        <Greetings
          name={sessionData?.user?.name}
          timeRange={timeRange}
          selectTimeRange={setTimeRange}
        />
      ) : (
        <GreetingsSkeleton />
      )}
      <Recap timeRange={timeRange} />
    </section>
  );
};
//prettier-ignore
const Greetings = dynamic(() => import("~/components/ui/Greetings"),{ loading: () => <GreetingsSkeleton />});

//prettier-ignore
const TopRatedCard = dynamic(() => import("~/components/recap/cards/UserTopCard"),{loading: () => <RecapSkeleton />});

//prettier-ignore
const MoodCard = dynamic(() => import("~/components/recap/cards/MoodCard"),{loading: () => <RecapSkeleton />});

//prettier-ignore
const TagsCard = dynamic(() => import("~/components/recap/cards/TagsCard"),{loading: () => <RecapSkeleton />});

//prettier-ignore
const RecommendedCard = dynamic(() => import("~/components/recap/cards/RecommendedCard"),{loading: () => <RecapSkeleton />});

const Recap = ({ timeRange = "short_term" }: RecapPropsType) => {
  const os = useOs();
  const cards = useMemo(
    () => [
      <TopRatedCard timeRange={timeRange} key={"topRatedCard"} />,
      <MoodCard key={"moodCard"} />,
      <RecommendedCard key={"recommendedCard"} />,
      <TagsCard key={"tagsCard"} />,
    ],
    [timeRange]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      console.log(entry);
    }
    console.log(entry);
  }, [entry]);

  return (
    <>
      {os === "android" || os === "ios" ? (
        <div className="flex flex-col justify-between gap-2">
          <section className="carousel rounded-box w-full sm:hidden">
            {cards?.map((card, i) => (
              <div
                className="carousel-item w-full justify-center pr-2"
                key={i}
                ref={ref}
              >
                {card}
              </div>
            ))}
          </section>
          <section className="hidden sm:grid sm:grid-cols-2 sm:gap-2 lg:grid-cols-3">
            {cards?.map((_, i) => (
              <div key={i} className="h-1 w-1 rounded-full bg-slate-300"></div>
            ))}
          </section>
          <div className="flex justify-center gap-1 pt-3">
            {cards?.map((_, i) => (
              <div key={i} className="h-1 w-1 rounded-full bg-slate-300"></div>
            ))}
          </div>
        </div>
      ) : (
        <section className="sm:grid sm:grid-cols-2 sm:gap-2 lg:grid-cols-3">
          {cards.map((card) => card)}
        </section>
      )}
    </>
  );
};
function GreetingsSkeleton() {
  return (
    <div className="flex flex-col gap-2 sm:max-w-sm">
      <div className="flex h-16 w-full animate-pulse flex-col gap-2 rounded-xl bg-base-300 p-2 [&>div]:rounded-2xl">
        <div className="h-8 w-3/4 bg-base-200"></div>
        <div className="h-8 w-1/2 bg-base-200"></div>
      </div>
      <div className="flex h-8 w-32 animate-pulse flex-col justify-center rounded-lg bg-base-300 p-2">
        <div className="h-4 rounded-2xl bg-base-200"></div>
      </div>
    </div>
  );
}

Home.getLayout = (page) => <MainLayout>{page}</MainLayout>;
export default Home;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const language = getCookie(langKey, { req, res }) as Language;

  return {
    props: {
      //prettier- ignore
      ...(await serverSideTranslations(language ?? "en", [
        "home",
        "common",
        "modals",
      ])),
    },
  };
};
