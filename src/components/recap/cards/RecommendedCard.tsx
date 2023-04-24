import { useTranslation } from "next-i18next";
import TrackRow from "~/components/ui/TrackRow";
import RowsSkeleton from "~/components/ui/skeletons/SingleRowSkeleton";
import { api } from "~/utils/api";
import RecapCard from "../RecapCard";

const RecommendedCard = () => {
  //prettier-ignore
  const { data, isLoading, isError } = api.spotify_user.getRecommendedations.useQuery(undefined, {refetchOnWindowFocus: false});
  const { t } = useTranslation("home");

  return (
    <RecapCard key={"card-recommended"} loading={isLoading}>
      <RecapCard.Header key={"card-recommended"}>
        <p>{t("recap.for_you")}</p>
      </RecapCard.Header>
      <RecapCard.Container key={"container-recommended"} error={isError}>
        {isLoading && (
          <div className="flex flex-col gap-2">
            <RowsSkeleton rowsNumber={3} />
          </div>
        )}
        {data &&
          data.tracks.length > 0 &&
          data.tracks.map((track) => (
            <TrackRow
              track={track}
              key={track.id}
            />
          ))}
      </RecapCard.Container>
    </RecapCard>
  );
};

export default RecommendedCard;
