import { RecapCardCva } from "@components/cva/RecapCardCva";
import type { VariantProps } from "cva";
import type { PropsWithChildren, ReactNode } from "react";
import type { RecapSelectItemPropsType } from "~/types/spotify-types";
import { RecapCardHeaderCva } from "../cva/RecapCardHeaderCva";

type RecapHeaderType = RecapSelectItemPropsType & PropsWithChildren;
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
  intent,
  children,
}: RecapHeaderType) {
  return (
    <div className={RecapCardHeaderCva({ intent })} onClick={onClick} key={'RecapHeader'}>
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