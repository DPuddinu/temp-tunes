import { LazyMotion, domAnimation, m } from "framer-motion";
import { useState, type ReactNode } from "react";
import { cn } from "~/utils/utils";
import Fab from "./Fab";
import { PlusSVG } from "./icons";
const animationDuration = 0.08;

interface props {
  options: ReactNode[];
}
const FabGroup = ({ options }: props) => {
  const [open, setOpen] = useState(false);

  return (
    <LazyMotion features={domAnimation}>
      <div className="flex flex-col items-end gap-2">
        <div className="mb-2 mr-2 flex flex-col-reverse items-end gap-4">
          {options?.map((option, i) => (
            <m.div
              transition={{
                type: "spring",
                delay: open
                  ? animationDuration * (i + 1)
                  : animationDuration * (options.length - i + 1),
              }}
              initial={{ opacity: 0 }}
              animate={
                open
                  ? { opacity: 1, display: "block" }
                  : { opacity: 0, transitionEnd: { display: "none" } }
              }
              key={"child-" + i}
            >
              {option}
            </m.div>
          ))}
        </div>
        <Fab
          className={cn(open && "rotate-45")}
          onClick={() => setOpen((open) => !open)}
        >
          <PlusSVG />
        </Fab>
      </div>
    </LazyMotion>
  );
};

export default FabGroup;
