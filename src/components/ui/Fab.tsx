import { type ReactNode } from "react";
import { cn } from "~/utils/utils";

type size = "sm" | "md" | "lg";
type props = {
  size?: size;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
};

const Fab = ({
  size = "md",
  onClick,
  children,
  className,
  disabled,
}: props) => {
  return (
    <button
      disabled={disabled}
      className={cn(
        "btn-primary btn-circle btn transition-transform hover:scale-105 hover:cursor-pointer",
        disabled && "disabled hover:!cursor-not-allowed",
        size === "sm" && "btn-sm text-xl",
        size === "md" && "btn-md text-2xl",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Fab;
