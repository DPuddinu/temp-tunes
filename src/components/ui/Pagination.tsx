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
    <div className="btn-group flex justify-center items-center w-full">
      <div className="flex gap-[1px]">
        <button
          className="btn border-base-300 bg-base-100 hover:bg-neutral disabled:bg-base-200 disabled:bg-opacity-50"
          onClick={onPrev}
          disabled={prevDisabled}
        >
          {"<"}
        </button>
        <button
          className="btn border-none bg-base-100 hover:bg-neutral disabled:bg-base-200 disabled:bg-opacity-50"
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
