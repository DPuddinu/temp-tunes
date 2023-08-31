import { Transition } from "@headlessui/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState, type ReactNode } from "react";
import { cn } from "~/utils/utils";
import Fab from "./Fab";
import { PlusSVG } from "./icons";

const animationDuration = 60;

interface props {
  options: ReactNode[];
}
const FabGroup = ({ options }: props) => {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <>
      <DropdownMenu.Root modal={false} open={open}>
        <DropdownMenu.Trigger>
          <Fab
            className={cn(show && "rotate-45")}
            onClick={() => {
              setShow((show) => !show);
              if (!open) setOpen(true);
            }}
          >
            <PlusSVG />
          </Fab>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          align="end"
          side="top"
          className=" translate-y- relative mb-2 mr-2 flex flex-col-reverse items-end gap-4"
        >
          {options?.map((option, i) => (
            <>
              <Transition
                style={{ transitionDelay: `${animationDuration * (i + 1)}ms` }}
                appear={true}
                show={show}
                enter="ease-in-out duration-300 transition-all"
                enterFrom="opacity-0 scale-0 translate-y-full"
                enterTo="opacity-100"
              >
                <Transition.Child
                  style={{
                    transitionDelay: `${
                      animationDuration * (options.length - i + 1)
                    }ms`,
                  }}
                  leave="ease-in-out duration-200 transition-all "
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0 scale-0 translate-x-full"
                  afterLeave={() => setOpen(false)}
                >
                  {option}
                </Transition.Child>
              </Transition>
            </>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};



export default FabGroup;
