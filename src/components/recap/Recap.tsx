import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import MoodCard from "./MoodCard";
import RecommendedCard from "./RecommendedCard";
import UserTopCard, { type RecapPropsType } from "./UserTopCard";

const Recap = ({ timeRange = "short_term" }: RecapPropsType) => {
  const session = useSession();
  const { data, isLoading, isError } = api.prisma_router.getTagsByUser.useQuery(
    {
      userId: session.data?.user?.id ?? "",
    }
  );

  console.log(data);

  return (
    <div className="md:grid md:grid-cols-3 md:gap-3">
      <UserTopCard timeRange={timeRange} key={"userTopCard"} tags={data} />
      <MoodCard />
      <RecommendedCard />
    </div>
  );
};

export default Recap;
