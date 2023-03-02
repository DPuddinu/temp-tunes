import { RecapCardHeaderCva } from "@components/cva/RecapCardHeaderCva";
import type { PropsWithChildren } from "react";
import type { RecapSelectItemPropsType } from "../../types/spotify-types";

export const RecapCardHeader = ({
  onClick,
  intent,
  children,
}: RecapSelectItemPropsType & PropsWithChildren) => {
  return (
    <div className={RecapCardHeaderCva({ intent })} onClick={onClick}>
      {children}
    </div>
  );
};
