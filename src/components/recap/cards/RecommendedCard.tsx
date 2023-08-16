import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { RecapSkeleton } from "~/components/ui/skeletons/RecapSkeleton";
import { SquareSkeleton } from "~/components/ui/skeletons/SquareSkeleton";
import { api } from "~/utils/api";
import RecapCard from "../RecapCard";

const TrackRow = dynamic(
  () => import("~/components/ui/TrackRow"),
  {
    loading: () => <SquareSkeleton />,
  }
);

const RecommendedCard = () => {
  //prettier-ignore
  const { data, isLoading, isError } = api.spotify_user.getRecommendedations.useQuery(undefined, {refetchOnWindowFocus: false});
  const { t } = useTranslation("home");
  const { t: t_common } = useTranslation("common");
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
        {data?.tracks.map((track) => (
          <TrackRow key={track.id} track={track} />
        ))}
        {data?.tracks.length === 0 && (
          <div className="grid place-content-center pt-4">
            {t_common("empty")}
          </div>
        )}{" "}
      </RecapCard.Container>
    </RecapCard>
  );
};

export default RecommendedCard;
