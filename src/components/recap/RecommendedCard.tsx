import { useTranslation } from "next-i18next";
import { useSpotifyStore } from "~/core/store";
import type { TagsObject } from "~/server/api/routers/prisma_router";
import { api } from "~/utils/api";
import RowsSkeleton from "../ui/skeletons/SingleRowSkeleton";
import TrackRow from "../ui/TrackRow";
import RecapCard from "./RecapCard";
import { RecapContainer } from "./RecapCardContainer";
import { RecapCardHeader } from "./RecapSelectItem";

const RecommendedCard = () => {
  //prettier-ignore
  const { data, isLoading, isError } =
    api.spotify_user.getRecommendedations.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });
  const { t } = useTranslation("home");
  const {tags} = useSpotifyStore();
  
  return (
    <RecapCard
      key={"card-recommended"}
      intent={"recommended"}
      loading={isLoading}
    >
      <RecapCardHeader key={"card-recommended"} intent={"singleCard"}>
        <p>{t("recap.for_you")}</p>
      </RecapCardHeader>
      <RecapContainer key={"container-recommended"} error={isError}>
        {isLoading && (
          <div className="flex flex-col gap-2">
            <RowsSkeleton rowsNumber={3}/>
          </div>
        )}
        {data &&
          data.tracks.length > 0 &&
          data.tracks.map((track) => (
            <TrackRow
              spotifyId={track.id}
              tagType={"track"}
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
