import { cva } from "cva";

// prettier-ignore
export const ToastCva = cva(
  [
    "alert",
  ],
  {
    variants: {
      intent: {
        base: ["bg-base-100"],
        primary: ["bg-primary"],
        accent: ["bg-accent"]
      },
    },
    defaultVariants: {
      intent: "base",
    },
  }
);
