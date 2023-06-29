interface PropsPagination {
  prevDisabled: boolean;
  nextDisabled: boolean;
  onNext: () => void;
  onPrev: () => void;
}
const PaginationComponent = ({
  onNext,
  prevDisabled,
  nextDisabled,
  onPrev,
}: PropsPagination) => {
  return (
    <div className="btn-group m-auto flex justify-center lg:w-3/4">
      <div className="flex">
        <button
          className="btn border-none hover:bg-neutral disabled:bg-base-200 disabled:bg-opacity-50"
          onClick={onPrev}
          disabled={prevDisabled}
        >
          {"<"}
        </button>
        <button
          className="btn border-none  hover:bg-neutral"
          onClick={onNext}
          disabled={nextDisabled}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};
export default PaginationComponent;
