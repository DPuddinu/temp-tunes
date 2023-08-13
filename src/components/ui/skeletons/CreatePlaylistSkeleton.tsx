const CreatePlaylistSkeleton = () => {
  return (
    <div className="flex animate-pulse flex-col items-center gap-2 ">
      <div className="h-12 w-96 bg-base-300 rounded-lg"></div>
      <div className="h-56 w-96 max-w-sm rounded-lg bg-base-300 p-2 pb-4 shadow "></div>
      <div className="flex items-center justify-center gap-2">
        <div className="btn h-12 w-32 bg-base-300"></div>
        <div className="btn h-12 w-32 bg-base-300"></div>
      </div>
    </div>
  );
};

export default CreatePlaylistSkeleton;
