import { useTranslation } from "next-i18next";
import { api } from "~/utils/api";
import MoodContainer from "../mood/MoodContainer";
import SingleRowSkeleton from "../ui/skeletons/SingleRowSkeleton";
import RecapCard from "./RecapCard";
import { RecapContainer } from "./RecapCardContainer";
import { RecapCardHeader } from "./RecapSelectItem";

const MoodCard = () => {
  const {
    data: moodData,
    isLoading: isMoodLoading,
    isError: moodError,
  } = api.spotify_user.getMood.useQuery();
  const { t } = useTranslation("home");

  return (
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
  );
};

export default MoodCard;
