import { useTranslation } from "next-i18next";
import { useStore } from "~/core/store";
import { api } from "~/utils/api";
import TrackRow from "../ui/TrackRow";
import RowsSkeleton from "../ui/skeletons/SingleRowSkeleton";
import RecapCard from "./RecapCard";
import { RecapContainer } from "./RecapCardContainer";

const RecommendedCard = () => {
  //prettier-ignore
  const { data, isLoading, isError, error } = api.spotify_user.getRecommendedations.useQuery(undefined, {refetchOnWindowFocus: false});
  const { t } = useTranslation("home");
  const { tags } = useStore();

  return (
    <RecapCard
      key={"card-recommended"}
      intent={"recommended"}
      loading={isLoading}
    >
      <RecapCard.Header key={"card-recommended"} intent={"singleCard"}>
        <p>{t("recap.for_you")}</p>
      </RecapCard.Header>
      <RecapContainer key={"container-recommended"} error={isError}>
        {isLoading && (
          <div className="flex flex-col gap-2">
            <RowsSkeleton rowsNumber={3} />
          </div>
        )}
        {data &&
          data.tracks.length > 0 &&
          data.tracks.map((track) => (
            <TrackRow
              spotifyId={track.id}
              trackTags={tags ? tags[track.id] ?? [] : []}
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
