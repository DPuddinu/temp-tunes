import { cva } from "cva";

export const RecapCardCva = cva(
  ["bg-base-300 mt-4 rounded-xl sm:mt-8 shadow w-full max-w-[40rem]"],
  {
    variants: {
      intent: {
        active: ["hover:text-accent-content "],
        static: [],
      },
    },
    defaultVariants: {
      intent: "static",
    },
  }
);
