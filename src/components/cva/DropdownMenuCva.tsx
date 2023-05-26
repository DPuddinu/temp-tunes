import { cva } from "cva";

export const DropdownMenuContentCva = cva(
  ["dropdown-content menu rounded-box relative w-52 p-2 shadow"],
  {
    variants: {
      intent: {
        darkest: "bg-base-300",
        dark: "bg-base-200",
        light: "bg-base-100",
      },
    },
    defaultVariants: {
      intent: "light",
    },
  }
);
