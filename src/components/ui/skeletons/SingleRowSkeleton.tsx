const SingleRowSkeleton = () => {

  return (
    <div className=" w-full rounded-md p-4 shadow ">
      <div className="flex animate-pulse space-x-4 ">
        <div className="h-10 w-10 rounded-full bg-slate-400"></div>
      </div>
    </div>
  );
}

export default SingleRowSkeleton