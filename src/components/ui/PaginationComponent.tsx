import { useState, type Dispatch, type SetStateAction } from "react";
import { PaginationItemCva } from "../cva/PaginationItemCva";

const maxPages = 5;
interface PropsPagination {
  maxVisiblePages: number;
  totalPages: number;
  activePage: number;
  setActivePage: Dispatch<SetStateAction<number>>;
}
const PaginationComponent = ({
  maxVisiblePages,
  totalPages,
  activePage,
  setActivePage,
}: PropsPagination) => {
  const [pages, setPages] = useState<number[]>([
    ...Array(maxVisiblePages > totalPages ? totalPages : maxPages).keys(),
  ]);

  function nextPage() {
    setActivePage((page) => {
      shift(page + 1);
      return page + 1;
    });
  }
  function prevPage() {
    setActivePage((page) => {
      shift(page - 1);
      return page - 1;
    });
  }
  function shift(currentPage: number) {
    const last = pages[pages.length - 1];
    const first = pages[0];
    if (last && currentPage > last) {
      setPages((pages) => pages.map((page) => page + 1));
    }
    if (first && currentPage < first) {
      setPages((pages) => pages.map((page) => page - 1));
    }
  }

  return (
    <div className="btn-group mt-3 flex justify-center">
      {/* MOBILE */}
      <div className="flex sm:hidden">
        <button className="btn  bg-neutral" onClick={() => prevPage()}>
          {"<"}
        </button>
        <button className="btn" onClick={() => nextPage()}>
          {">"}
        </button>
      </div>

      {/* DESKTOP */}
      <div className="hidden sm:flex">
        <button
          className="btn bg-neutral"
          onClick={prevPage}
          disabled={activePage - 1 < 0}
        >
          {"<"}
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setActivePage(page)}
            className={PaginationItemCva({
              intent: page === activePage ? "active" : "inactive",
            })}
          >
            {page + 1}
          </button>
        ))}
        <button
          className="btn bg-neutral"
          onClick={nextPage}
          disabled={activePage + 1 === totalPages}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};
export default PaginationComponent;
