import { useTranslation } from "next-i18next";
import { api } from "~/utils/api";
import RecapCard from "../recap/RecapCard";
import { RecapContainer } from "../recap/RecapCardContainer";
import { RecapCardHeader } from "../recap/RecapSelectItem";
import MoodContainer from "./MoodContainer";

const MoodCard = () => {
  const { data, isLoading, isError } = api.spotify_user.getMood.useQuery();
  const { t } = useTranslation("home");

  return (
    <RecapCard key={"card-moody"} intent={"moody"} loading={isLoading}>
      <RecapCardHeader key={"mood-header"} intent={"singleCard"}>
        <p>{t("recap.mood")}</p>
      </RecapCardHeader>
      <RecapContainer key={"container-mood"} error={isError}>
        {data && <MoodContainer mood={data} />}
      </RecapContainer>
    </RecapCard>
  );
};

export default MoodCard;
