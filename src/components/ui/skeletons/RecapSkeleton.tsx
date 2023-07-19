export const RecapSkeleton = () => {
  return (
    <div className="flex h-80 w-full animate-pulse flex-col gap-2 rounded-xl bg-base-300 p-4 [&>div]:w-full [&>div]:rounded-xl">
      <div className="grid h-12 grid-cols-2 gap-2 [&>div]:h-full [&>div]:rounded-xl [&>div]:bg-base-200">
        <div></div>
        <div></div>
      </div>
      <div className="grow bg-base-200"></div>
      <div className="flex w-full justify-center">
        <div className="h-10 w-1/3 rounded-xl bg-base-200"></div>
      </div>
    </div>
  );
};
