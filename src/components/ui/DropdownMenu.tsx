import type { VariantProps } from "cva";
import type { ReactNode } from "react";
import { cn } from "~/utils/utils";
import { DropdownMenuContentCva } from "../cva/DropdownMenuCva";
import { VerticalDots } from "./icons/VerticalDots";

type DropdownProps = {
  children: ReactNode;
  className?: string;
} & VariantProps<typeof DropdownMenuContentCva>;

export function DropdownMenu({ children, intent, className }: DropdownProps) {
  return (
    <div className={cn("dropdown-bottom dropdown-end dropdown", className)}>
      <label
        tabIndex={0}
        className="btn border-none bg-transparent p-0 hover:bg-transparent"
      >
        <VerticalDots />
      </label>
      <ul tabIndex={0} className={DropdownMenuContentCva({ intent })}>
        {children}
      </ul>
    </div>
  );
}
