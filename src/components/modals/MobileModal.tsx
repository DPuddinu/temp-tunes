import { Dialog, Transition } from '@headlessui/react';
import type { BaseModalProps } from './BaseModal';
import { Fragment, useState, type TouchEvent } from "react";

const minSwipeDistance = 50;

const MobileModal = ({
  onClose,
  children,
  description,
  isOpen,
  title,
}: BaseModalProps) => {
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(0); // otherwise the swipe is fired even with usual touch events
    if (e.targetTouches.item(0)) setTouchStart(e.targetTouches.item(0).clientY);
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) =>
    setTouchEnd(e.targetTouches.item(0).clientY);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isSwipeDown = distance < -minSwipeDistance;
    if (isLeftSwipe || isSwipeDown) onClose();
  };
  return (
    <Transition show={isOpen}>
      <Dialog
        as="div"
        className="fixed bottom-0 left-0 z-10 w-screen overflow-hidden"
        onClose={onClose}
      >
        <div className="flex min-h-screen items-end justify-center text-center backdrop-blur-sm">
          <Dialog.Overlay className="fixed inset-0 z-0 bg-black/40" />

          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="translate-y-full"
            enterTo=""
            leave="ease-in-out duration-200"
            leaveFrom=""
            leaveTo="translate-y-full"
          >
            <Dialog.Panel
              className="z-50 min-h-[50vh] w-full overflow-y-auto rounded-t-[10px] bg-base-300 text-left shadow-xl"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="pt-4">
                <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-base-content" />
              </div>
              {title && (
                <Dialog.Title className="mb-4 border-b-[1px] border-b-base-content pb-2 text-center font-medium text-base-content">
                  {title}
                </Dialog.Title>
              )}
              {description && (
                <Dialog.Description className="mt-2">
                  <p className="text-md border-t pt-2 text-base-content ">
                    {description}
                  </p>
                </Dialog.Description>
              )}
              <div className=" p-2 text-base-content">{children}</div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MobileModal