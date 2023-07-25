import { Transition } from "@headlessui/react";
import type { VariantProps } from "cva";
import { cn } from "~/utils/utils";
import { ToastCva } from "../cva/ToastCva";

type ToastProps = {
  className?: string;
  message: string | undefined;
} & VariantProps<typeof ToastCva>;
const Toast = ({ className, intent, message }: ToastProps) => {
  return (
    <>
      <Transition
        show={!!message}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-125"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className={cn("toast !whitespace-normal pb-20", className)}>
          <div className={ToastCva({ intent })}>{message}</div>
        </div>
      </Transition>
    </>
  );
};
export default Toast;
