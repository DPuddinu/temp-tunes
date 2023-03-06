import type { TopType } from "../../types/spotify-types";
import MoodCard from "./MoodCard";
import RecommendedCard from "./RecommendedCard";
import UserTopCard, { type RecapPropsType } from "./UserTopCard";

const Recap = ({ timeRange = "short_term" }: RecapPropsType) => {
  return (
    <div className="md:grid md:grid-cols-3 md:gap-3">
      <UserTopCard timeRange={timeRange} key={"userTopCard"} />
      <MoodCard />
      <RecommendedCard />
    </div>
  );
};

export default Recap;

export function getTranslationByType(type: TopType) {
  switch (type) {
    case "artists":
      return "recap.top_artists";
    case "tracks":
      return "recap.top_tracks";
  }
}
