import { RecapCardCva } from "@components/cva/RecapCardCva";
import type { VariantProps } from "cva";
import type { PropsWithChildren } from "react";
import RowsSkeleton from "../ui/skeletons/SingleRowSkeleton";
import type { RecapSelectItemPropsType } from "~/types/spotify-types";
import { RecapCardHeaderCva } from "../cva/RecapCardHeaderCva";

type RecapHeaderType = RecapSelectItemPropsType & PropsWithChildren
type RecapCardProps = { loading?: boolean } & PropsWithChildren & VariantProps<typeof RecapCardCva>;

const RecapCard = ({ children, intent, loading }: RecapCardProps) => {
  return (
    <div className={RecapCardCva({ intent })}>
      {loading ? <RowsSkeleton rowsNumber={4} /> : children}
    </div>
  );
};

RecapCard.Header = function RecapCardHeader({onClick, intent, children}: RecapHeaderType) {
  return (
    <div className={RecapCardHeaderCva({ intent })} onClick={onClick}>
      {children}
    </div>
  );
};

export default RecapCard;