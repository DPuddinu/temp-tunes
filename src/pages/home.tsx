import MainLayout from "@components/MainLayout";
import Recap from "@components/recap/Recap";
import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import type {
  TimeRangeType
} from "src/types/spotify-types";
import { useSpotifyStore } from "~/core/store";
import { Greetings } from "../components/Greetings";
import type { PageWithLayout } from "../types/page-types";
import { api } from "~/utils/api";

const Home: PageWithLayout = () => {
  const { data: sessionData } = useSession();
  const { playlists, setPlaylists } = useSpotifyStore();


  const { data: userPlaylists, isLoading } = api.spotify_playlist.getAllPlaylists.useQuery({itemsPerPage: 50});
  
  useEffect(() => {
    if (userPlaylists && playlists.length === 0) setPlaylists(userPlaylists);
  }, []);

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
  return {
    props: {
      //prettier- ignore
      ...(await serverSideTranslations(context.locale ?? "en", ["home","common","modals"])),
    },
  };
};
