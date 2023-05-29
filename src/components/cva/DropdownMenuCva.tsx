import { cva } from "cva";

export const DropdownMenuContentCva = cva(
  ["dropdown-content menu rounded-box relative w-52 p-2 shadow scale-0 focus:scale-100"],
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
