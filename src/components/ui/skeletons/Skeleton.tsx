export const PlaylistPageSkeleton = () => {
  return (
    <div className="flex w-full animate-pulse flex-col gap-4 [&>*]:w-full [&>*]:rounded-xl ">
      <div className="flex h-20 w-full flex-col justify-center gap-2 border-base-300 bg-base-200 pl-4 lg:w-3/4">
        <div className="h-5 w-16 rounded-xl bg-base-300"></div>
        <div className="h-5 w-28 rounded-xl bg-base-300"></div>
      </div>
      <div className="flex w-full grow flex-col items-center justify-center gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:w-3/4">
        <PlaylistComponentSkeleton />
        <PlaylistComponentSkeleton />
        <PlaylistComponentSkeleton />
        <PlaylistComponentSkeleton />
        <PlaylistComponentSkeleton />
        <PlaylistComponentSkeleton />
      </div>
      <div className="flex w-full justify-center bg-base-100">
        <div className="h-10 w-40 rounded-xl bg-base-200"></div>
      </div>
    </div>
  );  
}


export const PlaylistComponentSkeleton = () => {
  return (
    <div className="flex max-h-20 gap-2 rounded-2xl border-base-300 bg-base-200 shadow w-full">
      <div className="h-20 w-20 min-w-[5rem] bg-base-300 rounded-xl"></div>
      <div className="flex grow flex-col justify-center gap-2 truncate px-4">
        <div className="h-5 w-full rounded-xl bg-base-300"></div>
        <div className="h-5 w-full rounded-xl bg-base-300"></div>
      </div>
    </div>
  );
};