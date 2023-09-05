import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { motion, useAnimate } from "framer-motion";
import type { BaseModalProps } from "./BaseModal";

const closeAnimation = { transform: "translateY(100%)" };
const initAnimation = { transform: "translateY(0)" };

const MobileModal = ({
  onClose,
  children,
  description,
  isOpen,
  title,
}: BaseModalProps) => {
  const [scope, animate] = useAnimate();

  return (
    <AlertDialog.Root open={isOpen}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-0 h-full bg-black/40" />
        <AlertDialog.Content className="fixed bottom-0 left-0 z-50 w-screen overflow-hidden">
          <div className="relative h-screen ">
            <motion.div
              ref={scope}
              drag="y"
              dragElastic={0.2}
              dragConstraints={{ top: -50 }}
              dragSnapToOrigin
              whileDrag={{}}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
              }}
              onDragEnd={(_, info) => {
                if (
                  (info.offset.y > 20 && info.velocity.y > 4) ||
                  info.offset.y > 100
                ) {
                  animate(scope.current, closeAnimation).then(onClose);
                }
              }}
              animate={initAnimation}
              initial={closeAnimation}
              exit={closeAnimation}
              className="absolute bottom-0 right-0 mb-[-20vh] h-[70vh] w-full overflow-y-auto rounded-t-[10px] bg-base-300 text-left shadow-xl"
            >
              <div className="pt-4">
                <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-base-content" />
              </div>
              {title && (
                <AlertDialog.Title className="mb-4 border-b-[1px] border-b-base-content pb-2 text-center font-medium text-base-content">
                  {title}
                </AlertDialog.Title>
              )}
              {description && (
                <AlertDialog.Description className="mt-2">
                  <p className="text-md border-t pt-2 text-base-content ">
                    {description}
                  </p>
                </AlertDialog.Description>
              )}
              <div className=" p-2 text-base-content">{children}</div>
            </motion.div>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default MobileModal;
