import MoodContainer from "@components/mood/MoodContainer";
import { api } from "@trpc";
import SingleRowSkeleton from "@ui/skeletons/SingleRowSkeleton";
import type { GetServerSideProps } from "next";
import type { Session } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import type {
  Artist,
  TimeRangeType,
  TopType,
  Track
} from "../../types/spotify-types";
import { TopTypeArray } from "../../types/spotify-types";
import TrackRow from "../ui/TrackRow";
import { RecapArtistRow } from "./RecapArtistRow";
import RecapCard from "./RecapCard";
import { RecapContainer } from "./RecapCardContainer";
import { RecapCardHeader } from "./RecapSelectItem";

export type RecapPropsType = {
  timeRange: TimeRangeType;
  sessionData: Session | null;
};

const Recap = ({ timeRange = "short_term", sessionData }: RecapPropsType) => {
  // prettier-ignore
  const [selectedType, setSelectedType] = useState<TopType>("tracks");
  const [topPage, setTopPage] = useState(0);

  const { t } = useTranslation("home");
  // prettier-ignore
  const {
    data: recapData,
    fetchNextPage,
    isLoading: isRecapLoading,
    isError: topError,
  } = api.spotify_user.getTop.useInfiniteQuery({
    type: selectedType,
    timeRange: timeRange,
  });

  const {
    data: moodData,
    isLoading: isMoodLoading,
    isError: moodError,
  } = api.spotify_user.getMood.useQuery();

  const {
    data: recommendedData,
    isLoading: isRecommendedLoading,
    isError: isRecommendedError,
  } = api.spotify_user.getRecommendedations.useQuery();

  return (
    <div className="md:grid md:grid-cols-3 md:gap-3">
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

      <RecapCard key={"card-moody"} intent={"moody"} loading={isMoodLoading}>
        <RecapCardHeader key={"mood-header"} intent={"singleCard"}>
          <p>{t("recap.mood")}</p>
        </RecapCardHeader>
        <RecapContainer key={"container-mood"} error={moodError}>
          {isMoodLoading && (
            <div className="flex flex-col gap-2">
              <SingleRowSkeleton />
              <SingleRowSkeleton />
              <SingleRowSkeleton />
            </div>
          )}
          {moodData && <MoodContainer mood={moodData}></MoodContainer>}
        </RecapContainer>
      </RecapCard>

      <RecapCard
        key={"card-recommended"}
        intent={"recommended"}
        loading={isRecommendedLoading}
      >
        <RecapCardHeader key={"card-recommended"} intent={"singleCard"}>
          <p>{t("recap.for_you")}</p>
        </RecapCardHeader>
        <RecapContainer
          key={"container-recommended"}
          error={isRecommendedError}
        >
          {isRecommendedLoading && (
            <div className="flex flex-col gap-2">
              <SingleRowSkeleton />
              <SingleRowSkeleton />
              <SingleRowSkeleton />
            </div>
          )}
          {recommendedData &&
            recommendedData.tracks.length > 0 &&
            recommendedData.tracks.map((track) => (
              <TrackRow
                key={track.id}
                artists={track.artists.map((artist) => artist.name)}
                label={track.name}
              />
            ))}
        </RecapContainer>
      </RecapCard>
    </div>
  );
};

export default Recap;

export function getTranslationByType(type: TopType) {
  switch (type) {
    case "artists":
      return "recap.top_artists";
    case "tracks":
      return "recap.top_tracks";
  }
}
