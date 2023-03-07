const RowsSkeleton = ({ rowsNumber }: { rowsNumber: number }) => {
  const rows = [...Array(rowsNumber)];

  return (
    <>
      {rows.map((row) => (
        <div key={row} className="w-full rounded-md bg-base-100 p-4 shadow">
          <div className="flex animate-pulse space-x-4 ">
            <div className="h-10 w-10 rounded-full bg-base-300"></div>
            <div className="h-10 w-96 rounded-lg bg-base-300"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default RowsSkeleton;
