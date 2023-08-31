import type { ReactNode } from "react";
import Fab from "./Fab";

interface FabChildProps {
  children: ReactNode;
  label: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

const FabChild = function Child({
  label,
  children,
  className,
  disabled = false,
  onClick,
}: FabChildProps) {
  return (
    <div className="flex items-center gap-4 hover:-translate-x-1 hover:scale-105">
      <div className="rounded-md bg-neutral p-1 px-3 uppercase">{label}</div>
      <Fab
        size="sm"
        disabled={disabled}
        onClick={onClick}
        className={className}
      >
        {children}
      </Fab>
    </div>
  );
};
export default FabChild;