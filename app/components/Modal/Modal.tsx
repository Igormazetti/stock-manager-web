import { ReactNode } from "react";
import { Modal, ModalContent } from "@nextui-org/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  children: ReactNode;
}

export default function ModalComponent({
  isOpen,
  onClose,
  children,
  size,
  ...rest
}: ModalProps) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={size} {...rest}>
        <ModalContent>{children}</ModalContent>
      </Modal>
    </>
  );
}
