import { useMediaQuery } from "@mantine/hooks";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { useMemo, useState, type ReactNode } from "react";
import { TimeRangeArray, type TimeRangeType } from "~/types/spotify-types";
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

const Recap = () => {
  const matches = useMediaQuery("(max-width: 425px)");
  const [timeRange, setTimeRange] = useState<TimeRangeType>("short_term");
  const { t } = useTranslation("home");

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
      <div className="pb-2">
        <p className="mt-2 font-medium text-base-content">{t("recap.title")}</p>
        <select
          className="select select-sm mt-4 w-32 bg-base-300 bg-opacity-75"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRangeType)}
        >
          {TimeRangeArray.map((range, i) => (
            <option className="mt-1 p-1" key={i} value={range}>
              {t(range)}
            </option>
          ))}
        </select>
      </div>

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
