import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState, type ReactNode } from "react";
import { cn } from "~/utils/utils";
import Fab from "./Fab";
import { PlusSVG } from "./icons";
import { m } from "framer-motion";
import { LazyMotion, domAnimation } from "framer-motion";
const animationDuration = 0.1;

interface props {
  options: ReactNode[];
}
const FabGroup = ({ options }: props) => {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <LazyMotion features={domAnimation}>
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
            <m.div
              onAnimationComplete={() => {
                if (!show && i === 0) setOpen(false);
              }}
              transition={{
                ease: "easeInOut",
                delay: show
                  ? animationDuration * (i + 1)
                  : animationDuration * (options.length - i + 1),
              }}
              initial={{ opacity: 0 }}
              animate={show ? { opacity: 1 } : { opacity: 0 }}
              key={i}
            >
              {option}
            </m.div>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </LazyMotion>
  );
};

export default FabGroup;
