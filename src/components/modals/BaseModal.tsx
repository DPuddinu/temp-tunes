import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Drawer } from "vaul";
import useMediaQuery from "~/hooks/use-media-query";

type Props = {
  title?: string | null | undefined;
  description?: string;
  children?: React.ReactNode;
} & BaseModalProps;

export type BaseModalProps = {
  isOpen?: boolean;
  isLoading?: boolean;
  onClose: () => void;
};

const BaseModal = ({
  isOpen,
  title,
  description,
  children,
  onClose,
}: Props) => {
  const matches = useMediaQuery("(min-width: 425px)");

  return (
    <>
      {matches ? (
        <Center
          onClose={onClose}
          isOpen={isOpen}
          description={description}
          title={title}
        >
          {children}
        </Center>
      ) : (
        <Bottom
          onClose={onClose}
          isOpen={isOpen}
          description={description}
          title={title}
        >
          {children}
        </Bottom>
      )}
    </>
  );
};

export default BaseModal;

const Center = ({ onClose, isOpen, description, title, children }: Props) => {
  return (
    <Transition show={isOpen}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto "
        onClose={onClose}
      >
        <div className="flex min-h-screen place-items-center justify-center text-center backdrop-blur-sm">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-10 0"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="m-10 mt-2 w-full max-w-lg overflow-hidden rounded-2xl bg-base-content p-6 pt-4 pb-4 text-left shadow-xl">
              {title && (
                <Dialog.Title className="text-xl font-bold leading-6 tracking-wide text-base-100">
                  {title}
                </Dialog.Title>
              )}
              {description && (
                <Dialog.Description className="mt-2">
                  <p className="text-md border-t pt-2 text-base-100">
                    {description}
                  </p>
                </Dialog.Description>
              )}
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

const Bottom = ({ onClose, children, description, isOpen, title }: Props) => {
  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <Drawer.Trigger asChild>
        <button></button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex flex-col rounded-t-[10px] bg-base-100">
          <div className="flex-1 rounded-t-[10px] bg-base-100 ">
            <div className="pt-4">
              <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-base-300 " />
            </div>
            <Drawer.Title className="mb-4 border-b-[1px] border-b-base-content pb-2 text-center font-medium text-base-content">
              {title}
            </Drawer.Title>
            {description && (
              <Drawer.Description className="mt-2">
                <p className="text-md border-t pt-2 ">{description}</p>
              </Drawer.Description>
            )}
            <div className="p-4 text-base-content"> {children}</div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
