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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center backdrop-blur-sm">
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

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-10 0"
            leaveTo="opacity-0 scale-95"
          >
            <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl bg-base-content p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-base-100"
              >
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
                  onClick={onClose}
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
