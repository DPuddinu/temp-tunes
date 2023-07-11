import type { VariantProps } from "cva";
import type { ReactNode } from "react";
import { cn } from "~/utils/utils";
import { DropdownMenuContentCva } from "../cva/DropdownMenuCva";
import { VerticalDotsSVG } from "./icons/VerticalDotsSVG";

type DropdownProps = {
  children: ReactNode;
  className?: string;
} & VariantProps<typeof DropdownMenuContentCva>;

const DropdownMenu = ({ children, intent, className }: DropdownProps) => {
  return (
    <div className={cn("dropdown-bottom dropdown-end dropdown", className)}>
      <label
        tabIndex={0}
        className="btn border-none bg-transparent p-0 hover:bg-transparent"
      >
        <VerticalDotsSVG />
      </label>
      <ul tabIndex={0} className={DropdownMenuContentCva({ intent })}>
        {children}
      </ul>
    </div>
  );
}
DropdownMenu.displayName = "DropdownMenu";
export interface DropdownOptionProps {
  label: string;
  onClick: () => void;
}
DropdownMenu.Options = function DropdownMenuOptions({options}: {options: DropdownOptionProps[]}) {
  return (
    <>
      {options.map((opt) => (
        <li
          key={opt.label}
          className="disabled bg-transparent"
          onClick={opt.onClick}
        >
          <div className="flex gap-2 rounded-xl">
            <a>{opt.label}</a>
          </div>
        </li>
      ))}
    </>
  );
};


export default DropdownMenu