import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "~/utils/utils";

type RecapHeaderType = {
  onClick?: () => void;
  active?: boolean;
} & PropsWithChildren;
type RecapCardProps = {
  loading?: boolean;
  fallback: ReactNode;
} & PropsWithChildren;
type RecapContainerProps = { error: boolean } & PropsWithChildren;

const RecapCard = ({ children, loading, fallback }: RecapCardProps) => {
  return (
    <div className="w-full max-w-[40rem] overflow-clip rounded-xl bg-base-300 shadow sm:mt-8 ">
      {loading ? fallback : children}
    </div>
  );
};

RecapCard.Header = function RecapCardHeader({
  onClick,
  children,
}: RecapHeaderType) {
  return (
    <div
      className={cn(
        "flex items-center justify-center p-4 pb-0 text-center text-lg font-medium tracking-wide text-base-content hover:cursor-pointer",
        
      )}
      onClick={onClick}
      key={"RecapHeader"}
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
      {children && <div className="flex flex-col p-2">{children}</div>}
      {error && <h1>Error!</h1>}
    </>
  );
};

export default RecapCard;
