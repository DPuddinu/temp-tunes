import { useState } from "react";
import { useTranslation } from "next-i18next";
import {
  type TimeRangeType,
  TopTypeArray,
  type Artist,
  type TopType,
  type Track,
} from "~/types/spotify-types";
import { api } from "~/utils/api";
import TrackRow from "../ui/TrackRow";
import { getTranslationByType } from "./Recap";
import { RecapArtistRow } from "./RecapArtistRow";
import RecapCard from "./RecapCard";
import { RecapContainer } from "./RecapCardContainer";
import { RecapCardHeader } from "./RecapSelectItem";

export type RecapPropsType = {
  timeRange: TimeRangeType;
};
const UserTopCard = ({ timeRange = "short_term" }: RecapPropsType) => {
  const [selectedType, setSelectedType] = useState<TopType>("tracks");
  const [topPage, setTopPage] = useState(0);
  const { t } = useTranslation("home");
  
  const {
    data: recapData,
    fetchNextPage,
    isLoading: isRecapLoading,
    isError: topError,
  } = api.spotify_user.getTop.useInfiniteQuery({
    type: selectedType,
    timeRange: timeRange,
  });

  return (
    <RecapCard
      key={"card-top-rated"}
      intent={"topRated"}
      loading={isRecapLoading}
    >
      <div className="grid grid-cols-2">
        {TopTypeArray.map((type, i) => (
          <RecapCardHeader
            key={i}
            onClick={() => setSelectedType(type)}
            intent={selectedType === type ? "selected" : "primary"}
          >
            <p
              className={`${
                selectedType === type
                  ? "border  border-transparent border-b-white"
                  : ""
              } pb-2 md:text-lg`}
            >
              {t(getTranslationByType(type))}
            </p>
          </RecapCardHeader>
        ))}
      </div>
      <RecapContainer key={"container-top-rated"} error={topError}>
        {recapData &&
          recapData?.pages[topPage]?.items &&
          recapData?.pages[topPage]?.items.items.map(
            (item: Artist | Track, i) => (
              <>
                {selectedType === "artists" ? (
                  <RecapArtistRow
                    artistImageUrl={(item as Artist).images[2]?.url}
                    position={i}
                    label={(item as Artist).name}
                    key={i}
                  />
                ) : (
                  <TrackRow
                    showMedals
                    artists={(item as Track).artists.map(
                      (artist) => artist.name
                    )}
                    label={(item as Track).name}
                    position={i}
                    key={i}
                  />
                )}
              </>
            )
          )}
      </RecapContainer>
    </RecapCard>
  );
};

export default UserTopCard;
