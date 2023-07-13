export const TemplatesSkeleton = () => {
  return (
    <div className="grid animate-pulse gap-2 sm:grid-cols-2 lg:grid-cols-3">
      <SingleSkeleton />
      <SingleSkeleton />
      <SingleSkeleton />
      <SingleSkeleton />
      <SingleSkeleton />
      <SingleSkeleton />
    </div>
  );
}
const SingleSkeleton = () => {
  return (
    <div className="rounded-box h-20 bg-base-300">
      <div className="flex h-full items-center justify-between gap-2 px-2">
        <div className="h-6 w-32 rounded-xl bg-base-200"></div>
        <div className="mr-3 h-6 w-3 rounded-xl bg-base-200"></div>
      </div>
    </div>
  );
}