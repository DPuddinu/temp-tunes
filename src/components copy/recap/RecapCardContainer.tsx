import type { PropsWithChildren } from "react";
type RecapContainerProps = {
  error: boolean;
} & PropsWithChildren;

export const RecapContainer = ({ children, error }: RecapContainerProps) => {
  return (
    <>
      <br />
      {children && <div className="flex flex-col p-2">{children}</div>}
      {error && <h1>Error!</h1>}
    </>
  );
};
