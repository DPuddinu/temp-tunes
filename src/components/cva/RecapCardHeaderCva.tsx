import { cva } from "cva";

// prettier-ignore
export const RecapCardHeaderCva = cva(
  [
    "text-center p-4 pb-0 flex items-center justify-center text-lg tracking-wide font-medium text-base-content",
  ],
  {
    variants: {
      intent: {
        active: ["hover:text-base-content hover:cursor-pointer"],
        static: "",
      },
    },
    defaultVariants: {
      intent: "static",
    },
  }
);
