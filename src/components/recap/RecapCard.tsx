import { RecapCardCva } from "@components/cva/RecapCardCva";
import type { VariantProps } from "cva";
import type { PropsWithChildren } from "react";
import type { RecapSelectItemPropsType } from "~/types/spotify-types";
import { RecapCardHeaderCva } from "../cva/RecapCardHeaderCva";
import RowsSkeleton from "../ui/skeletons/SingleRowSkeleton";

type RecapHeaderType = RecapSelectItemPropsType & PropsWithChildren;
type RecapCardProps = { loading?: boolean } & PropsWithChildren &
  VariantProps<typeof RecapCardCva>;
type RecapContainerProps = { error: boolean } & PropsWithChildren;

const RecapCard = ({ children, intent, loading }: RecapCardProps) => {
  return (
    <div className={RecapCardCva({ intent })}>
      {loading ? <RowsSkeleton rowsNumber={4} /> : children}
    </div>
  );
};

RecapCard.Header = function RecapCardHeader({
  onClick,
  intent,
  children,
}: RecapHeaderType) {
  return (
    <div className={RecapCardHeaderCva({ intent })} onClick={onClick}>
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
      <br />
      {children && <div className="flex flex-col p-2">{children}</div>}
      {error && <h1>Error!</h1>}
    </>
  );
};


export default RecapCard;