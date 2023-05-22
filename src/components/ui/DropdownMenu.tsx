import { ReactNode } from "react";
import { cn } from "~/utils/utils";
import { VerticalDots } from "./icons/VerticalDots";

interface DropdownProps {
  children: ReactNode;
  className?: string;
}
export function DropdownMenu({ children, className }: DropdownProps) {
  return (
    <div className={cn("dropdown-end dropdown-bottom dropdown flex items-center", className)}>
      <label tabIndex={0} >
        <VerticalDots />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
      >
        {children}
      </ul>
    </div>
  );
}
