import { cva } from "cva";

export const RecapCardCva = cva(
  ["bg-base-300 mt-4 rounded-xl sm:mt-8 p-2 h-fit shadow"],
  {
    variants: {
      intent: {
        active: [
          "hover:text-accent-content ",
        ],
        static: []
      },
    },
    defaultVariants: {
      intent: "static",
    },
  }
);
