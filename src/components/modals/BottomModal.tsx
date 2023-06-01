import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

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

export const BottomModal = ({
  isOpen,
  title,
  description,
  children,
  onClose,
}: Props) => {
  return (
    <Transition show={isOpen}>
      <Dialog
        as="div"
        className="fixed bottom-0 left-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex min-h-screen justify-center items-end text-center backdrop-blur-sm">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="ease-in-out duration-200"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <div className="h-[50vh] w-screen overflow-hidden rounded-t-2xl bg-base-content p-6  text-left shadow-xl">
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

              <Dialog.Panel className="mt-2 mb-2 pt-4 pb-4 h-full">
                {children}
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

