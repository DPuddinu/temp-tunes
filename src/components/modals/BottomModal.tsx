import { Dialog, Transition } from "@headlessui/react";

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
        <div className="flex min-h-screen items-end justify-center text-center backdrop-blur-sm">
          <Dialog.Overlay className="fixed inset-0" />

          <Transition.Child
            as="div"
            enter="ease-in-out duration-300"
            enterFrom="translate-y-full"
            enterTo=""
            leave="ease-in-out duration-200"
            leaveFrom=""
            leaveTo="translate-y-full"
          >
            <Dialog.Panel className="h-[50vh] w-screen overflow-hidden rounded-t-2xl bg-base-content p-6 text-left shadow-xl">
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
              <div className="h-100 pt-6">{children}</div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

