import ModalComponent from "@/app/components/Modal/Modal";
import { Button, ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react";
import React from "react";

interface AddProductModal {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductModal({ isOpen, onClose }: AddProductModal) {
  return (
    <ModalComponent isOpen={isOpen} onClose={onClose}>
      <>
        <ModalHeader className="flex flex-col gap-1">Adicionar Produto</ModalHeader>
        <ModalBody>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non risus hendrerit venenatis. Pellentesque sit
            amet hendrerit risus, sed porttitor quam.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non risus hendrerit venenatis. Pellentesque sit
            amet hendrerit risus, sed porttitor quam.
          </p>
          <p>
            Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
            incididunt cillum quis. Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit incididunt nisi
            consectetur esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="solid" onPress={() => console.log("")}>
            Fechar
          </Button>
          <Button color="primary" onPress={() => console.log("")}>
            Salvar
          </Button>
        </ModalFooter>
      </>
    </ModalComponent>
  );
}
