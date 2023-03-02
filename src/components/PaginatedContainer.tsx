import { useState } from "react";

type DataType = {
  pages: { items: any[] }[];
};
type PropsType = {
  data: DataType;
  loadNextPage: () => void;
};
const PaginatedContainer = ({ data, loadNextPage }: PropsType) => {
  const [page, setPage] = useState(0);

  return (
    <div className="p-4">
      {data.pages[page]?.items.map((item: any, i) => (
        <h1 key={i}>{item.name}</h1>
      ))}
      <button
        className="btn-primary btn rounded text-white"
        onClick={() => {
          loadNextPage();
          setPage((page) => page + 1);
        }}
      >
        Next Page
      </button>
      <button
        className="btn-primary btn rounded text-white"
        onClick={() => setPage((page) => (page > 0 ? page - 1 : 0))}
      >
        Previous Page
      </button>
    </div>
  );
};

export default PaginatedContainer;
