import { cva } from "cva";

export const FloatingActionButtonCVA = cva(
  [
    "btn-primary btn-circle btn transition-transform hover:scale-105 hover:cursor-pointer",
  ],
  {
    variants: {
      intent: {
        primary: ["btn-primary"],
        secondary: ["btn-secondary"],
      },
      size: {
        sm: "btn-sm text-xl",
        md: "btn-md text-2xl",
        lg: "btn-lg text-3xl",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  }
);
