import type { VariantProps } from "cva";
import type { ReactNode } from "react";
import { cn } from "~/utils/utils";
import { DropdownMenuContentCva } from "../cva/DropdownMenuCva";
import { VerticalDotsSVG } from "./icons/VerticalDotsSVG";

export type DropdownDirection = "up" | "down" | "left" | "right";
type DropdownProps = {
  children: ReactNode;
  className?: string;
  direction?: DropdownDirection;
} & VariantProps<typeof DropdownMenuContentCva>;

const DropdownMenu = ({
  children,
  intent,
  className,
  direction = "down",
}: DropdownProps) => {
  return (
    <div
      className={cn(
        " dropdown-end dropdown",
        className,
        direction === "down" && "dropdown-bottom",
        direction === "up" && "dropdown-top",
        direction === "right" && "dropdown-right",
        direction === "left" && "dropdown-left"
      )}
    >
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
};
DropdownMenu.displayName = "DropdownMenu";
export interface DropdownOptionProps {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}
DropdownMenu.Options = function DropdownMenuOptions({
  options,
}: {
  options: DropdownOptionProps[];
}) {
  return (
    <>
      {options.map(({ label, onClick, disabled }) => (
        <li
          key={label}
          className={cn("bg-transparent", disabled && "disabled")}
          onClick={onClick}
        >
          <div className={"rounded-xl"}>
            <a>{label}</a>
          </div>
        </li>
      ))}
    </>
  );
};

export default DropdownMenu;
