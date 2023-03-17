import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import MoodCard from "../mood/MoodCard";
import RecommendedCard from "./RecommendedCard";
import TopRatedCard, { type RecapPropsType } from "./UserTopCard";

const Recap = ({ timeRange = "short_term" }: RecapPropsType) => {
  const session = useSession();

  //prettier-ignore
  const { data } = api.prisma_router.getTagsByUser.useQuery({userId: session.data?.user?.id ?? ""});

  return (
    <section className="md:grid md:grid-cols-3 md:gap-3">
      <TopRatedCard timeRange={timeRange} tags={data} />
      <MoodCard />
      <RecommendedCard tags={data} />
    </section>
  );
};

export default Recap;
