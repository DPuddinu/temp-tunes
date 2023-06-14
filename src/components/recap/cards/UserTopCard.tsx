import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import {
  TopTypeArray,
  type Artist,
  type TimeRangeType,
  type TopType,
  type Track,
} from "~/types/spotify-types";
import { api } from "~/utils/api";
import { ArtistRow } from "../../ui/ArtistRow";
import PaginationComponent from "../../ui/PaginationComponent";
import TrackRow from "../../ui/TrackRow";
import RecapCard from "../RecapCard";

export type RecapPropsType = {
  timeRange: TimeRangeType;
};

export const itemsPerPageOptions = ["5", "10", "15", "20"];
export const totalItems = 50;
const itemsPerPage = 5;

const UserTopCard = ({ timeRange = "short_term" }: RecapPropsType) => {
  const { t } = useTranslation("home");
  const [selectedType, setSelectedType] = useState<TopType>("tracks");
  const [selectedPage, setSelectedPage] = useState(0);
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
    setSelectedPage(0)
  }, [timeRange])

  return (
    <RecapCard key={"card-top-rated"} intent={"active"} loading={isLoading}>
      <div className="grid grid-cols-2">
        {TopTypeArray.map((type) => (
          <RecapCard.Header
            key={type}
            onClick={() => {
              setSelectedType(type);
              setSelectedPage(0);
            }}
            intent={selectedType === type ? "static" : "active"}
          >
            <p
              key={type}
              className={`${
                selectedType === type
                  ? "border border-transparent border-b-base-content"
                  : ""
              } pb-2 md:text-lg`}
            >
              {t(getTranslationByType(type))}
            </p>
          </RecapCard.Header>
        ))}
      </div>
      <RecapCard.Container error={isError}>
        {data &&
          data.items[selectedPage] &&
          data.items[selectedPage]?.map((item, i) => (
            <>
              {selectedType === "artists" ? (
                <ArtistRow artist={item as Artist} key={i} />
              ) : (
                <TrackRow track={item as Track} key={i} />
              )}
            </>
          ))}
        {data && data.totalItems > itemsPerPage && (
          <PaginationComponent
            key={"pagination"}
            activePage={selectedPage}
            setActivePage={setSelectedPage}
          />
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
