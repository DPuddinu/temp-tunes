import { cva } from "cva";

// prettier-ignore
export const RecapCardHeaderCva = cva(
  [
    "text-center p-4 pb-0 flex items-center justify-center text-accent-content text-lg tracking-wide",
  ],
  {
    variants: {
      intent: {
        primary: [" hover:text-base-content hover:cursor-pointer"],
        selected: [" "],
        singleCard: "",
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  }
);
