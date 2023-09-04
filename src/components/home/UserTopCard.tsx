import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { RecapSkeleton } from "~/components/ui/skeletons/RecapSkeleton";
import { RectangleSkeleton } from "~/components/ui/skeletons/RectangleSkeleton";
import {
  TopTypeArray,
  type Artist,
  type TimeRangeType,
  type TopType,
  type Track,
} from "~/types/spotify-types";
import { api } from "~/utils/api";
import { cn } from "~/utils/utils";
import { ArtistRow } from "../ui/ArtistRow";
import PaginationComponent from "../ui/Pagination";
import RecapCard from "./RecapCard";

export type RecapPropsType = {
  timeRange: TimeRangeType;
};

export const itemsPerPageOptions = ["5", "10", "15", "20"];
export const totalItems = 50;
const itemsPerPage = 5;

//prettier-ignore
const TrackRow = dynamic(() => import("~/components/ui/TrackRow"), {loading: () => <RectangleSkeleton />});

const UserTopCard = ({ timeRange = "short_term" }: RecapPropsType) => {
  const { t } = useTranslation("home");
  const { t: t_common } = useTranslation("common");

  const [selectedType, setSelectedType] = useState<TopType>("tracks");
  const [selectedPage, setSelectedPage] = useState(0);

  const { data: playlists } = api.spotify_playlist.getAll.useQuery();
  const { data, isLoading, isError } = api.spotify_user.getTopRated.useQuery(
    {
      type: selectedType,
      timeRange: timeRange,
      itemsPerPage: itemsPerPage,
      totalItems: totalItems,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    setSelectedPage(0);
  }, [timeRange]);

  const _data = data?.items[selectedPage];

  return (
    <RecapCard
      key="card-top-rated"
      loading={isLoading}
      fallback={<RecapSkeleton />}
    >
      <div className="grid grid-cols-2">
        {TopTypeArray.map((type) => (
          <RecapCard.Header
            key={type}
            onClick={() => {
              setSelectedType(type);
              setSelectedPage(0);
            }}
          >
            <p
              key={type}
              className={cn(
                "pb-2 md:text-lg",
                selectedType === type &&
                  "border border-transparent border-b-base-content"
              )}
            >
              {t(getTranslationByType(type))}
            </p>
          </RecapCard.Header>
        ))}
      </div>
      <RecapCard.Container error={isError}>
        {_data?.map((item, i) => (
          <>
            {selectedType === "artists" ? (
              <ArtistRow artist={item as Artist} key={i} />
            ) : (
              <TrackRow track={item as Track} playlists={playlists} key={i} />
            )}
          </>
        ))}

        {data && data.totalItems > itemsPerPage && (
          <div className="fle-col flex grow justify-end pt-2">
            <PaginationComponent
              nextDisabled={selectedPage + 1 > data.items.length - 1}
              prevDisabled={selectedPage - 1 < 0}
              onNext={() =>
                setSelectedPage((page) => {
                  return page + 1;
                })
              }
              onPrev={() =>
                setSelectedPage((page) => {
                  return page - 1;
                })
              }
            />
          </div>
        )}
        {!_data && (
          <div className="grid place-content-center pt-4">
            {t_common("empty")}
          </div>
        )}
      </RecapCard.Container>
    </RecapCard>
  );
};

export default UserTopCard;

function getTranslationByType(type: TopType) {
  switch (type) {
    case "artists":
      return "recap.top_artists";
    case "tracks":
      return "recap.top_tracks";
  }
}
