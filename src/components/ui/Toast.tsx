import { Transition } from "@headlessui/react";
import { cn } from "~/utils/utils";

type ToastProps = {
  className?: string;
  message: string | undefined;
};
const Toast = ({ className, message }: ToastProps) => {
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
        <div className={cn("toast !whitespace-normal  pb-20", className)}>
          <div className="alert bg-primary">{message}</div>
        </div>
      </Transition>
    </>
  );
};
export default Toast;
