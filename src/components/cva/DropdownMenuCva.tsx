import { cva } from "cva";

export const DropdownMenuContentCva = cva(
  [
    "dropdown-content menu rounded-box z-50 w-52 p-2 scale-0 focus:scale-100 shadow border",
  ],
  {
    variants: {
      intent: {
        darkest: "bg-base-300  border-base-200",
        dark: "bg-base-200  border-base-100",
        light: "bg-base-100  border-base-200",
      },
    },
    defaultVariants: {
      intent: "light",
    },
  }
);
