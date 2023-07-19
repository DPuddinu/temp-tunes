import { Transition } from "@headlessui/react";
import { type VariantProps } from "cva";
import { useState, type ReactNode } from "react";
import { FloatingActionButtonCVA } from "../cva/FloatingActionButtonCva";

type props = {
  options?: ReactNode[];
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
} & VariantProps<typeof FloatingActionButtonCVA>;

const FloatingActionButton = ({
  intent,
  size,
  options,
  onClick,
  children,
  disabled,
}: props) => {
  const [open, setOpen] = useState(false);

  return (
    <Transition appear={true} show={true}>
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
          <div
            className="mb-2 mr-2 flex flex-col items-end gap-2"
            onClick={() => setOpen((open) => !open)}
          >
            {options?.map((option) => (
              <>{option}</>
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
          className={`${FloatingActionButtonCVA({ intent, size })} ${
            disabled && "disabled"
          }`}
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
