import MainLayout from "@components/MainLayout";
import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { TimeRangeType } from "src/types/spotify-types";
import GreetingsSkeleton from "~/components/ui/skeletons/GreetingsSkeleton";
import { RecapSkeleton } from "~/components/ui/skeletons/RecapSkeleton";
import { getPageProps } from "~/utils/helpers";
import type { PageWithLayout } from "../types/page-types";

const Recap = dynamic(() => import("~/components/home/Recap"), {
  loading: () => <RecapSkeleton />,
});

const Home: PageWithLayout = () => {
  const { data: sessionData } = useSession();
  // prettier-ignore
  const [timeRange, setTimeRange] = useState<TimeRangeType>("short_term");

  return (
    <section>
      {sessionData?.user?.name ? (
        <>
          <Greetings
            name={sessionData?.user?.name}
            timeRange={timeRange}
            selectTimeRange={setTimeRange}
          />
          <Recap timeRange={timeRange} />
        </>
      ) : (
        <GreetingsSkeleton />
      )}
    </section>
  );
};
//prettier-ignore
const Greetings = dynamic(() => import("~/components/ui/Greetings"), {
  loading: () => <GreetingsSkeleton />,
});

Home.getLayout = (page) => <MainLayout>{page}</MainLayout>;
export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getPageProps(["home", "common", "modals"], context);
};

