import { VariantProps } from "cva";
import { ReactNode } from "react";
import { cn } from "~/utils/utils";
import { DropdownMenuContentCva } from "../cva/DropdownMenuCva";
import { VerticalDots } from "./icons/VerticalDots";

type DropdownProps = {
  children: ReactNode;
  className?: string;
} & VariantProps<typeof DropdownMenuContentCva>;

export function DropdownMenu({ children, className, intent }: DropdownProps) {
  console.log(className)
  return (
    <>
      <div className={cn(`dropdown-end dropdown items-center `, className)}>
        <label tabIndex={0}>
          <VerticalDots />
        </label>
        <ul tabIndex={0} className={DropdownMenuContentCva({ intent })}>
          {children}
        </ul>
      </div>
    </>
  );
}
