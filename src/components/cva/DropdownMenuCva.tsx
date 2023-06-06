import { cva } from "cva";

export const DropdownMenuContentCva = cva(
  [
    "dropdown-content menu rounded-box z-50 w-52 p-2 scale-0 focus:scale-100 shadow",
  ],
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
