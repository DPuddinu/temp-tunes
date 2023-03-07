import { useTranslation } from "next-i18next";
import { api } from "~/utils/api";
import RecapCard from "../recap/RecapCard";
import { RecapContainer } from "../recap/RecapCardContainer";
import { RecapCardHeader } from "../recap/RecapSelectItem";
import RowsSkeleton from "../ui/skeletons/SingleRowSkeleton";
import MoodContainer from "./MoodContainer";

const MoodCard = () => {
  const { data, isLoading, isError } = api.spotify_user.getMood.useQuery();
  const { t } = useTranslation("home");

  return (
    <RecapCard key={"card-moody"} intent={"moody"}>
      <RecapCardHeader key={"mood-header"} intent={"singleCard"}>
        <p>{t("recap.mood")}</p>
      </RecapCardHeader>
      <RecapContainer key={"container-mood"} error={isError}>
        {isLoading && (
          <div className="flex flex-col gap-2">
            <RowsSkeleton rowsNumber={5} />
          </div>
        )}
        {data && <MoodContainer mood={data}></MoodContainer>}
      </RecapContainer>
    </RecapCard>
  );
};

export default MoodCard;
