import { RecapCardCva } from "@components/cva/RecapCardCva";
import type { VariantProps } from "cva";
import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "~/utils/utils";

type RecapHeaderType = {
  onClick?: () => void;
  active?: boolean;
} & PropsWithChildren;
type RecapCardProps = {
  loading?: boolean;
  fallback: ReactNode;
} & PropsWithChildren &
  VariantProps<typeof RecapCardCva>;
type RecapContainerProps = { error: boolean } & PropsWithChildren;

const RecapCard = ({ children, intent, loading, fallback }: RecapCardProps) => {
  return (
    <div className={RecapCardCva({ intent })}>
      {loading ? fallback : children}
    </div>
  );
};

RecapCard.Header = function RecapCardHeader({
  onClick,
  active = false,
  children,
}: RecapHeaderType) {
  return (
    <div
      className={cn(
        "flex items-center justify-center p-4 pb-0 text-center text-lg font-medium tracking-wide text-base-content",
        active && "hover:cursor-pointer hover:text-base-content"
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
      {children && <div className="p-2">{children}</div>}
      {error && <h1>Error!</h1>}
    </>
  );
};

export default RecapCard;
