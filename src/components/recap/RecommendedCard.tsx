import { useTranslation } from "next-i18next";
import { api } from "~/utils/api";
import SingleRowSkeleton from "../ui/skeletons/SingleRowSkeleton";
import TrackRow from "../ui/TrackRow";
import RecapCard from "./RecapCard";
import { RecapContainer } from "./RecapCardContainer";
import { RecapCardHeader } from "./RecapSelectItem";

const RecommendedCard = () => {
  const {
    data: recommendedData,
    isLoading: isRecommendedLoading,
    isError: isRecommendedError,
  } = api.spotify_user.getRecommendedations.useQuery();
  const { t } = useTranslation("home");

  return (
    <RecapCard
      key={"card-recommended"}
      intent={"recommended"}
      loading={isRecommendedLoading}
    >
      <RecapCardHeader key={"card-recommended"} intent={"singleCard"}>
        <p>{t("recap.for_you")}</p>
      </RecapCardHeader>
      <RecapContainer key={"container-recommended"} error={isRecommendedError}>
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
  );
};

export default RecommendedCard;
