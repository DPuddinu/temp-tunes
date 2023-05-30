import { type Dispatch, type SetStateAction } from "react";
interface PropsPagination {
  activePage: number;
  setActivePage: Dispatch<SetStateAction<number>>;
}
const PaginationComponent = ({
  activePage,
  setActivePage,
}: PropsPagination) => {
  
  function nextPage() {
    setActivePage((page) => {
      return page + 1;
    });
  }
  function prevPage() {
    setActivePage((page) => {
      return page - 1;
    });
  }

  return (
    <div className="btn-group mt-3 flex justify-center">
      <div className="flex">
        <button
          className="btn  bg-neutral"
          onClick={() => prevPage()}
          disabled={activePage - 1 < 0}
        >
          {"<"}
        </button>
        <button className="btn" onClick={() => nextPage()}>
          {">"}
        </button>
      </div>
    </div>
  );
};
export default PaginationComponent;
