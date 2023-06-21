import type { VariantProps } from "cva";
import { ToastCva } from "../cva/ToastCva";
import { Transition } from "@headlessui/react";

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
        <div className={cn("toast pb-20", className)}>
          <div className={ToastCva({ intent })}>{message}</div>
        </div>
      </Transition>
    </>
  );
};
export default Toast