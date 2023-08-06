import { Transition } from "@headlessui/react";

interface RowValueProps {
  value: string;
  width: number;
  color: string;
}

export const ExpandRow = ({ color, value, width }: RowValueProps) => (
  <Transition
    className="flex flex-row-reverse"
    appear={true}
    show={true}
    enter="transition-width duration-[1200ms]"
    enterFrom="w-0"
    enterTo="w-full"
    leave="transition-width duration-[1200ms]"
    leaveFrom="w-full"
    leaveTo="w-0"
  >
    <div
      className="rounded-full px-5 py-0 text-center text-sm font-semibold text-accent-content flex items-center justify-center"
      style={{width: `${width}%`, background: color}}
    >{value}</div>
  </Transition>
);
