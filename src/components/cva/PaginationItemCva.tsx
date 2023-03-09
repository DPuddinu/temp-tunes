import { cva } from "cva";

export const PaginationItemCva = cva(["btn grow"], {
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
