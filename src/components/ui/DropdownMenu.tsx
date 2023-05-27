import { VariantProps } from "cva";
import { ReactNode } from "react";
import { cn } from "~/utils/utils";
import { DropdownMenuContentCva } from "../cva/DropdownMenuCva";
import { VerticalDots } from "./icons/VerticalDots";

type DropdownProps = {
  children: ReactNode;
  className?: string;
  onClick: () => void;
  open: boolean;
} & VariantProps<typeof DropdownMenuContentCva>;

export function DropdownMenu({ children, className, onClick, open, intent }: DropdownProps) {
  return (
    <>
      <div
        className={cn(
          "dropdown-end dropdown-bottom dropdown lg:hidden items-center lg:group-hover:flex",
          className
        )}
        onClick={onClick}
      >
        <label tabIndex={0}>
          <VerticalDots />
        </label>
        {open && (
          <ul tabIndex={0} className={DropdownMenuContentCva({intent})}>
            {children}
          </ul>
        )}
      </div>
    </>
  );
}
