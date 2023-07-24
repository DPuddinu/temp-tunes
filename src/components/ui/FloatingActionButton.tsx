import { Transition } from "@headlessui/react";
import { useClickOutside } from "@mantine/hooks";
import { type VariantProps } from "cva";
import { useState, type ReactNode } from "react";
import { cn } from "~/utils/utils";
import { FloatingActionButtonCVA } from "../cva/FloatingActionButtonCva";
type props = {
  options?: ReactNode[];
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
} & VariantProps<typeof FloatingActionButtonCVA>;

const FloatingActionButton = ({
  intent,
  size,
  options,
  onClick,
  children,
  className,
  disabled,
}: props) => {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  return (
    <Transition appear={true} show={true} ref={ref}>
      {open && (
        <Transition
          appear={true}
          show={true}
          enter="transition-all duration-75"
          enterFrom="scale-0 opacity-0 "
          enterTo="scale-100 opacity-100 flex justify-end"
          leave="transition-all duration-150"
          leaveFrom="scale-100 opacity-100 flex justify-end"
          leaveTo="scale-0 opacity-0"
        >
          <div className="mb-2 mr-2 flex flex-col items-end gap-4">
            {options?.map((option, i) => (
              <div key={i} onClick={() => setOpen(false)}>{option}</div>
            ))}
          </div>
        </Transition>
      )}

      <Transition.Child
        enter="transition-all duration-75"
        enterFrom="scale-0 opacity-0"
        enterTo="scale-100 opacity-100 flex justify-end"
        leave="transition-all duration-150"
        leaveFrom="scale-100 opacity-100 flex justify-end"
        leaveTo="scale-0 opacity-0"
      >
        <button
          className={cn(
            FloatingActionButtonCVA({ intent, size }),
            disabled && "disabled hover:!cursor-not-allowed",
            open && "rotate-45",
            className
          )}
          onClick={() => {
            if (options) setOpen((open) => !open);
            if (onClick) onClick();
          }}
        >
          {children}
        </button>
      </Transition.Child>
    </Transition>
  );
};

export default FloatingActionButton;
