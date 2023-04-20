import { cva } from "cva";

export const PaginationItemCva = cva(["btn grow  bg-neutral"], {
  variants: {
    intent: {
      active: ["btn-active bg-neutral-focus"],
      inactive: [],
    },
  },
  defaultVariants: {
    intent: "inactive",
  },
});
