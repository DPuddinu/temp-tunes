const BottomNavigationSkeleton = () => {
  return (
    <footer className="btm-nav flex w-full animate-pulse flex-row gap-2 bg-base-300 px-2">
      <div className="grid w-full grid-cols-4 items-center justify-center">
        <div className="m-auto h-8 w-8 rounded-full bg-base-100"></div>
        <div className="m-auto h-8 w-8 rounded-full bg-base-100"></div>
        <div className="m-auto h-8 w-8 rounded-full bg-base-100"></div>
        <div className="m-auto h-8 w-8 rounded-full bg-base-100"></div>
      </div>
    </footer>
  );
};

export default BottomNavigationSkeleton;
