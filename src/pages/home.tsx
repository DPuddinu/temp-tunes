import MainLayout from "@components/MainLayout";
import Recap from "@components/recap/Recap";
import type { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";
import type { TimeRangeType } from "src/types/spotify-types";
import { Greetings } from "../components/Greetings";
import type { NextPageWithLayout } from "../types/page-types";

const Home: NextPageWithLayout = () => {
  const { data: sessionData } = useSession();

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
      <Recap key={"recap"} timeRange={selectedTimeRange} sessionData={sessionData}/>
    </div>
  );
};

Home.getLayout = (page) => <MainLayout>{page}</MainLayout>;
export default Home;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", [
      "home",
      "common",
      "modals",
    ])),
  },
});
