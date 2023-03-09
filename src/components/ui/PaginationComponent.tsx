import { useState } from "react";
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

  const [cursor, setCursor] = useState(0)
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  function nextPage() {
    if (activePage < totalPages -1) selectPageByIndex(activePage + 1);
  }

  function prevPage() {
    if (activePage - 1 >= 0) selectPageByIndex(activePage - 1);
  }

  function selectPageByIndex(index: number) {
    if (index >= 0) setActivePage(index);
    if (index - 1 >= 0) setCursor(index - 1);
    if (index === 0) setCursor(0);
  }

  const PaginationButtons = () => {

    return (
      <>
        <PaginationButton
          index={cursor}
          isActive={cursor === activePage}
          selectPage={() => selectPageByIndex(cursor)}
        />
        <PaginationButton
          index={cursor + 1}
          isActive={cursor + 1 === activePage}
          selectPage={() => selectPageByIndex(cursor + 1)}
        />
        {cursor + 2 < totalPages && <PaginationButton
          index={cursor + 2}
          isActive={cursor + 2 === activePage}
          selectPage={() => selectPageByIndex(cursor+2)}
        />}
      </>
    );
    
  };

  return (
    <div className="btn-group mt-3">
      <button className="btn" onClick={() => selectPageByIndex(0)}>
        {"<<"}
      </button>
      <button className="btn" onClick={() => prevPage()}>
        {"<"}
      </button>
      <PaginationButtons />
      <button className="btn" onClick={() => nextPage()}>
        {">"}
      </button>
      <button className="btn" onClick={() => selectPageByIndex(totalPages - 1)}>
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
