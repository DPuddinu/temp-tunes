import type { VariantProps } from "cva";
import type { ReactNode } from "react";
import { DropdownMenuContentCva } from "../cva/DropdownMenuCva";
import { VerticalDots } from "./icons/VerticalDots";

type DropdownProps = {
  children: ReactNode;
  className?: string;
} & VariantProps<typeof DropdownMenuContentCva>;

export function DropdownMenu({ children, intent }: DropdownProps) {
  return (
    <div className="dropdown-end dropdown-bottom dropdown ">
      <label
        tabIndex={0}
        className="btn w-14 border-none bg-transparent p-0 hover:bg-transparent"
      >
        <VerticalDots />
      </label>
      <ul tabIndex={0} className={DropdownMenuContentCva({ intent })}>
        {children}
      </ul>
    </div>
  );
}
