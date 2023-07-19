import { useTranslation } from "next-i18next";
import { RecapSkeleton } from "~/components/ui/skeletons/RecapSkeleton";
import { api } from "~/utils/api";
import RecapCard from "../RecapCard";
import dynamic from "next/dynamic";
import { SquareSkeleton } from "~/components/ui/skeletons/SquareSkeleton";

const TrackRow = dynamic(() => import("~/components/ui/TrackRow"), {
  loading: () => <SquareSkeleton />,
});

const RecommendedCard = () => {
  //prettier-ignore
  const { data, isLoading, isError } = api.spotify_user.getRecommendedations.useQuery(undefined, {refetchOnWindowFocus: false});
  const { t } = useTranslation("home");

  return (
    <RecapCard
      key={"card-recommended"}
      loading={isLoading}
      fallback={<RecapSkeleton />}
    >
      <RecapCard.Header key={"card-recommended"}>
        <p>{t("recap.for_you")}</p>
      </RecapCard.Header>
      <RecapCard.Container key={"container-recommended"} error={isError}>
        {data &&
          data.tracks.length > 0 &&
          data.tracks.map((track) => (
            <TrackRow track={track} key={track.id} options={["EDIT_TAGS", "ADD_TO_PLAYLIST", "ADD_TO_QUEUE"]} />
          ))}
      </RecapCard.Container>
    </RecapCard>
  );
};

export default RecommendedCard;
