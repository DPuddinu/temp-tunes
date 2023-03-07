import { RecapCardCva } from "@components/cva/RecapCardCva";
import CardSkeleton from "@ui/skeletons/CardSkeleton";
import type { VariantProps } from "cva";
import type { PropsWithChildren } from "react";
import React from "react";

type Props = {
  loading?: boolean;
} & PropsWithChildren &
  VariantProps<typeof RecapCardCva>;
const RecapCard = ({ children, intent, loading }: Props) => {
  return (
    <div className={RecapCardCva({ intent })}>
      {loading ? <CardSkeleton /> : children}
    </div>
  );
};

export default RecapCard;
