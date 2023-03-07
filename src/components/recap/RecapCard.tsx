import { RecapCardCva } from "@components/cva/RecapCardCva";
import type { VariantProps } from "cva";
import type { PropsWithChildren } from "react";
import RowsSkeleton from "../ui/skeletons/SingleRowSkeleton";

type Props = {
  loading?: boolean;
} & PropsWithChildren &
  VariantProps<typeof RecapCardCva>;
const RecapCard = ({ children, intent, loading }: Props) => {
  return (
    <div className={RecapCardCva({ intent })}>
      {loading ? <RowsSkeleton rowsNumber={4} /> : children}
    </div>
  );
};

export default RecapCard;
