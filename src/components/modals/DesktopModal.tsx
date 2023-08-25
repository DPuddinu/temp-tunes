import React, { Fragment } from 'react'
import type { BaseModalProps } from './BaseModal';
import { Dialog, Transition } from '@headlessui/react';

const DesktopModal = ({
  onClose,
  isOpen,
  description,
  title,
  children,
}: BaseModalProps) => {
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
            <Dialog.Panel className="m-10 mt-2 w-full max-w-lg overflow-hidden rounded-2xl bg-base-300 p-6 pt-4 pb-4 text-left shadow-xl">
              {title && (
                <Dialog.Title className="text-xl font-bold leading-6 tracking-wide text-base-content">
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

export default DesktopModal