const CreatePlaylistSkeleton = () => {
  return (
    <div className="flex w-full animate-pulse flex-col items-center gap-2 ">
      <div className="h-12 w-full max-w-[24rem] rounded-lg bg-base-300"></div>
      <div className="h-56 max-w-[24rem] w-full rounded-lg bg-base-300 p-2 pb-4 shadow "></div>
      <div className="flex items-center justify-center gap-2">
        <div className="btn h-12 w-32 bg-base-300"></div>
        <div className="btn h-12 w-32 bg-base-300"></div>
      </div>
    </div>
  );
};

export default CreatePlaylistSkeleton;
