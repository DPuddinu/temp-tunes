import { Dialog, Transition } from "@headlessui/react";
import { useTranslation } from "next-i18next";
import { Fragment } from "react";

type Props = {
  title: string;
  description?: string;
  children?: React.ReactNode;
} & BaseModalProps;

export type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const BaseModal = ({
  isOpen,
  title,
  description,
  children,
  onConfirm,
  onClose,
}: Props) => {
  const { t } = useTranslation("modals");

  return (
    <Transition
      appear
      show={isOpen}
      enter="transition ease-in-out duration-300 transform"
      enterFrom="opacity-0 translate-y-full"
      enterTo="opacity-100  translate-y-0"
      leave="transition ease-in-out duration-300 transform"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-full"
    >
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
            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-base-content p-6 text-left shadow-xl">
              <Dialog.Title className="text-lg font-medium leading-6 text-base-100">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="mt-2">
                  <p className="text-md border-t pt-2 text-base-100">
                    {description}
                  </p>
                </Dialog.Description>
              )}

              <Dialog.Panel className="mt-2 mb-2 pt-4 pb-4">
                {children}
              </Dialog.Panel>
              <div className="mt-4 flex flex-row-reverse gap-2">
                <button
                  type="button"
                  className="bg- inline-flex justify-center rounded-md border border-transparent bg-accent-focus px-4 py-2 text-white duration-300 "
                  onClick={onConfirm}
                >
                  {t("confirm")}
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent  bg-error px-4 py-2 text-white duration-300 "
                  onClick={onClose}
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BaseModal;
