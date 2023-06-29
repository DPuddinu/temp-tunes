export const PlaylistSkeleton = () => {
  return (
    <div className="w-full animate-pulse rounded-xl bg-base-200 p-6 shadow">
      <div className="mb-6 rounded-xl">
        <div className="my-1 h-20 w-4/5 rounded-xl bg-base-300"></div>
        <div className="h-5 w-1/4 rounded-xl bg-base-300 text-sm font-light leading-4" />
      </div>
      <ContentSkeleton />
      <ContentSkeleton />
      <ContentSkeleton />
      <ContentSkeleton />
      <ContentSkeleton />
      <ContentSkeleton />
    </div>
  );
};
const ContentSkeleton = () => {
  return (
    <div className="mb-4 w-full rounded-xl bg-base-300 bg-opacity-50 p-4">
      <div className="mb-2 h-4 w-1/2 rounded-xl bg-base-300" />
      <div className="h-3 w-1/3 rounded-xl bg-base-300" />
    </div>
  );
};
