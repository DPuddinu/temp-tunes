import { useMediaQuery } from "@mantine/hooks";
import dynamic from "next/dynamic";

export type BaseModalProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
};

const DesktopModal = dynamic(() => import("./DesktopModal"));
const MobileModal = dynamic(() => import("./MobileModal"));

const BaseModal = ({
  isOpen,
  title,
  description,
  children,
  onClose,
}: BaseModalProps) => {
  const matches = useMediaQuery("(min-width: 425px)");

  return (
    <>
      {matches ? (
        <DesktopModal
          onClose={onClose}
          isOpen={isOpen}
          description={description}
          title={title}
        >
          {children}
        </DesktopModal>
      ) : (
        <MobileModal
          onClose={onClose}
          isOpen={isOpen}
          description={description}
          title={title}
        >
          {children}
        </MobileModal>
      )}
    </>
  );
};

export default BaseModal;
