import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import MainLayout from "~/components/layouts/MainLayout";
import GreetingsSkeleton from "~/components/ui/skeletons/GreetingsSkeleton";
import { RecapSkeleton } from "~/components/ui/skeletons/RecapSkeleton";
import { getPageProps } from "~/utils/helpers";
import type { PageWithLayout } from "../types/page-types";

//prettier-ignore
const Recap = dynamic(() => import("~/components/home/Recap"), {
  loading: () => (
    <div className="h-full p-2">
      <div className="sm:hidden">
        <RecapSkeleton />
      </div>
      <div className="hidden h-full sm:grid sm:grid-cols-2 sm:gap-2 lg:grid-cols-3">
        <RecapSkeleton />
        <RecapSkeleton />
        <RecapSkeleton />
        <RecapSkeleton />
      </div>
    </div>
  ),
});

//prettier-ignore
const Greetings = dynamic(() => import("~/components/home/Greetings"), {loading: () => <GreetingsSkeleton />});

const Home: PageWithLayout = () => {
  const { data: sessionData } = useSession();
  // prettier-ignore

  return (
    <section className="flex flex-col">
      {sessionData?.user?.name ? (
        <>
          <Greetings
            name={sessionData.user.name}
          />
          <Recap/>
        </>
      ) : (
        <GreetingsSkeleton />
      )}
    </section>
  );
};

Home.getLayout = (page) => <MainLayout>{page}</MainLayout>;
export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getPageProps(["home", "common", "modals"], context);
};
