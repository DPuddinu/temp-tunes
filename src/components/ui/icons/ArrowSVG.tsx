import { SortDirection } from "@tanstack/react-table";
import styles from "~/styles/search.module.css";

interface ArrowProps {
  isOpen?: false | SortDirection;
}

export const ArrowSVG = ({ isOpen }: ArrowProps) => {
  return (
    <div
      className={`flex items-center ${
        !isOpen ? "" : isOpen === "asc" ? styles.rotate : styles.rotate_reverse
      }`}
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
