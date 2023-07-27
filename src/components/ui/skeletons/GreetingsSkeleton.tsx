const GreetingsSkeleton = () => {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:max-w-sm">
      <div className="flex h-16 w-full animate-pulse flex-col gap-2 rounded-xl bg-base-300 p-2 [&>div]:rounded-2xl">
        <div className="h-8 w-3/4 bg-base-200"></div>
        <div className="h-8 w-1/2 bg-base-200"></div>
      </div>
      <div className="flex h-8 w-32 animate-pulse flex-col justify-center rounded-lg bg-base-300 p-2">
        <div className="h-4 rounded-2xl bg-base-200"></div>
      </div>
    </div>
  );
};

export default GreetingsSkeleton;
