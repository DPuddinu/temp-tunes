import { SortDirection } from "@tanstack/react-table";
import styles from "~/styles/search.module.css";
import { cn } from "~/utils/utils";

interface ArrowProps {
  isOpen?: false | SortDirection;
  className?: string;
}

export const ArrowSVG = ({ isOpen, className }: ArrowProps) => {
  return (
    <div
      className={cn(`flex items-center ${
        !isOpen ? "" : isOpen === "asc" ? styles.rotate : styles.rotate_reverse
      }`, className)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 20"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-4 w-4 focus:rotate-180 "
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    </div>
  );
};
