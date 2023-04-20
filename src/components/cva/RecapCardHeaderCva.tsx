import { cva } from "cva";

// prettier-ignore
export const RecapCardHeaderCva = cva(
  [
    "text-center p-4 pb-0 flex items-center justify-center text-accent-content text-lg tracking-wide font-medium",
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
