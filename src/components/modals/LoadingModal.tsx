import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import type { BaseModalProps } from "./BaseModal";
import { LoadingSpinner } from "../ui/LoadingSpinner";

const LoadingModal = ({ isOpen }: BaseModalProps) => {
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
        onClose={() => {
          return;
        }}
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto "
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
              <Dialog.Panel className="mt-2 mb-2 pt-4 pb-4">
                <LoadingSpinner></LoadingSpinner>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LoadingModal;
