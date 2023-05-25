import { ReactNode } from "react";
import { cn } from "~/utils/utils";
import { VerticalDots } from "./icons/VerticalDots";

interface DropdownProps {
  children: ReactNode;
  className?: string;
  onClick: () => void;
  open: boolean;
}
export function DropdownMenu({ children, className, onClick, open }: DropdownProps) {
  return (
    <>
      <div
        className={cn(
          "dropdown-end dropdown-bottom dropdown flex items-center",
          className
        )}
        onClick={onClick}
      >
        <label tabIndex={0}>
          <VerticalDots />
        </label>
        {open && (
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box relative w-52 bg-base-300 p-2 shadow"
          >
            {children}
          </ul>
        )}
      </div>
    </>
  );
}
