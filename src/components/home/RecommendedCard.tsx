import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { RecapSkeleton } from "~/components/ui/skeletons/RecapSkeleton";
import { api } from "~/utils/api";
import { RectangleSkeleton } from "../ui/skeletons/RectangleSkeleton";
import RecapCard from "./RecapCard";

//prettier-ignore
const TrackRow = dynamic(() => import("~/components/ui/TrackRow"), {loading: () => <RectangleSkeleton />});

const RecommendedCard = () => {
  //prettier-ignore
  const { data, isLoading, isError } = api.spotify_user.getRecommendedations.useQuery();
  const { data: playlists } = api.spotify_playlist.getAll.useQuery();

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
          <TrackRow key={track.id} track={track} playlists={playlists} />
        ))}
        {data?.tracks.length === 0 && (
          <div className="grid place-content-center pt-4">
            {t_common("empty")}
          </div>
        )}
      </RecapCard.Container>
    </RecapCard>
  );
};

export default RecommendedCard;
