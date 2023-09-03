import type { ReactNode } from "react";

type RecapHeaderType = {
  onClick?: () => void;
  active?: boolean;
  children: ReactNode;
};
type RecapCardProps = {
  loading?: boolean;
  fallback: ReactNode;
  children: ReactNode;
};
type RecapContainerProps = {
  error: boolean;
  children: ReactNode;
};

const RecapCard = ({ children, loading, fallback }: RecapCardProps) => {
  return (
    <>
      {loading ? (
        fallback
      ) : (
        <div className="flex w-full flex-col overflow-clip rounded-xl bg-base-300 bg-opacity-75 border-opacity-75 shadow ">
          {children}
        </div>
      )}
    </>
  );
};

RecapCard.Header = function RecapCardHeader({
  onClick,
  children,
}: RecapHeaderType) {
  return (
    <div
      className="flex items-center justify-center p-4 pb-0 text-center text-lg font-medium tracking-wide text-base-content hover:cursor-pointer"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

RecapCard.Container = function RecapContainer({
  children,
  error,
}: RecapContainerProps) {
  return (
    <>
      <div className="flex grow flex-col p-2">{children}</div>
      {error && <h1>Error!</h1>}
    </>
  );
};

export default RecapCard;
