import { cva } from "cva";

export const PaginationItemCva = cva(["btn"], {
  variants: {
    intent: {
      active: ["btn-active"],
      inactive: [],
    },
  },
  defaultVariants: {
    intent: "inactive",
  },
});
