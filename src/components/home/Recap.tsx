import { useMediaQuery, useOs } from "@mantine/hooks";
import dynamic from "next/dynamic";
import { useMemo, type ReactNode } from "react";
import type { RecapPropsType } from "~/components/home/UserTopCard";
import { RecapSkeleton } from "../ui/skeletons/RecapSkeleton";

//prettier-ignore
const TopRatedCard = dynamic(() => import("~/components/home/UserTopCard"),{loading: () => <RecapSkeleton />});

//prettier-ignore
const MoodCard = dynamic(() => import("~/components/home/MoodCard"),{loading: () => <RecapSkeleton />});

//prettier-ignore
const TagsCard = dynamic(() => import("~/components/home/TagsCard"),{loading: () => <RecapSkeleton />});

//prettier-ignore
const RecommendedCard = dynamic(() => import("~/components/home/RecommendedCard"),{loading: () => <RecapSkeleton />});

//prettier-ignore
const MobileCarousel = dynamic(() => import("./MobileCarousel"),{loading: () => <RecapSkeleton />});

const Recap = ({ timeRange = "short_term" }: RecapPropsType) => {
  const matches = useMediaQuery("(max-width: 425px)");

  const cards: ReactNode[] = useMemo(
    () => [
      <TopRatedCard timeRange={timeRange} key={"topRatedCard"} />,
      <MoodCard key={"moodCard"} />,
      <RecommendedCard key={"recommendedCard"} />,
      <TagsCard key={"tagsCard"} />,
    ],
    [timeRange]
  );

  return (
    <div className="h-full p-2">
      {matches ? (
        <>
          <MobileCarousel cards={cards} />
        </>
      ) : (
        <section className="grid h-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => card)}
        </section>
      )}
    </div>
  );
};

export default Recap;
