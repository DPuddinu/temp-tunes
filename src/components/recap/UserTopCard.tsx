import { useTranslation } from "next-i18next";
import { useState } from "react";
import type { TagsObject } from "~/server/api/routers/prisma_router";
import {
  TopTypeArray,
  type Artist, type TimeRangeType, type TopType,
  type Track
} from "~/types/spotify-types";
import { api } from "~/utils/api";
import TrackRow from "../ui/TrackRow";
import { RecapArtistRow } from "./RecapArtistRow";
import RecapCard from "./RecapCard";
import { RecapContainer } from "./RecapCardContainer";
import { RecapCardHeader } from "./RecapSelectItem";

export type RecapPropsType = {
  timeRange: TimeRangeType;
  tags: TagsObject | undefined
};
const UserTopCard = ({ timeRange = "short_term", tags }: RecapPropsType) => {
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
                    spotifyId={item.id}
                    spotifyType={"track"}
                    trackTags={tags ? tags[item.id] ?? [] : []}
                    showMedals
                    artists={(item as Track).artists.map(
                      (artist) => artist.name
                    )}
                    label={item.name}
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

function getTranslationByType(type: TopType) {
  switch (type) {
    case "artists":
      return "recap.top_artists";
    case "tracks":
      return "recap.top_tracks";
  }
}
