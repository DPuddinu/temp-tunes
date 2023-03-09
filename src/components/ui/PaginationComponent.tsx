import { PaginationItemCva } from "../cva/PaginationItemCva";

interface Props {
  totalItems: number;
  activePage: number;
  itemsPerPage: number;
  setActivePage: (page: number) => void;
}
interface PaginationButtonProps {
  index: number;
  isActive: boolean;
  selectPage: () => void;
}

//prettier-ignore
const PaginationComponent = ({
  totalItems,
  activePage = 0,
  setActivePage,
  itemsPerPage,
}: Props) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  function nextPage() {
    if (activePage < totalPages) setActivePage(activePage + 1);
  }

  function prevPage() {
    if (activePage - 1 >= 0) setActivePage(activePage - 1);
  }

  function selectPageByIndex(index: number) {
    setActivePage(index);
  }
  const pages = [...Array(totalPages).keys()];
  
  const PaginationButtons = () => {
    if (activePage > 2) {
      return (
        <>
          <button className="btn" onClick={() => setActivePage(activePage - 2)}>
            ...
          </button>
          <button
            className="btn-active btn"
            onClick={() => {
              return;
            }}
          >
            {activePage}
          </button>
          <button className="btn" onClick={() => setActivePage(activePage + 2)}>
            ...
          </button>
        </>
      );
    } else {
      const pagesBeforeCurrent = [...Array(activePage).keys()];

      return (
        <>
          {pagesBeforeCurrent.map((page) => (
            <PaginationButton
              key={page}
              index={page}
              isActive={false}
              selectPage={() => selectPageByIndex(page)}
            />
          ))}
          <PaginationButton
            index={activePage}
            isActive={true}
            selectPage={() => {
              return;
            }}
          />
          <PaginationButton
            index={activePage + 1}
            isActive={false}
            selectPage={() => setActivePage(activePage + 1)}
          />
        </>
      );
    }
  };

  return (
    <div className="btn-group mt-3">
      <button className="btn" onClick={() => setActivePage(0)}>
        {"<<"}
      </button>
      <button className="btn" onClick={() => prevPage()}>
        {"<"}
      </button>
      <PaginationButtons></PaginationButtons>
      {/* {pages.map((page) => (
        <PaginationButton
          key={page}
          index={page}
          isActive={activePage === page}
          selectPage={() => selectPageByIndex(page)}
        />
      ))} */}
      <button className="btn" onClick={() => nextPage()}>
        {">"}
      </button>
      <button className="btn" onClick={() => setActivePage(pages.length - 1)}>
        {">>"}
      </button>
    </div>
  );
};

//prettier-ignore
const PaginationButton = ({index, isActive, selectPage}: PaginationButtonProps) => {
  //prettier-ignore
  return <button className={PaginationItemCva({intent: isActive? "active": "inactive"})} onClick={selectPage}>{index + 1}</button>;
};
export default PaginationComponent;
