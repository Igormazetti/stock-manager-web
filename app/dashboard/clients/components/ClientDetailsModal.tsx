import React from "react";
import ModalComponent from "@/app/components/Modal/Modal";
import { ModalBody, ModalHeader } from "@nextui-org/react";
import { Client } from "@/app/interfaces/client";
import { Pencil } from "phosphor-react";

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client;
  onEdit?: () => void;
}

export default function ClientDetailsModal({
  isOpen,
  onClose,
  client,
  onEdit,
}: ClientDetailsModalProps) {
  return (
    <ModalComponent isOpen={isOpen} onClose={onClose}>
      <>
        <ModalHeader className="flex flex-col gap-1 text-gray-600 w-full text-center justify-between items-center">
          <div className="flex-1 text-center">Detalhes do Cliente</div>
          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit();
              }}
              className="p-2 hover:bg-blue-100 rounded transition-colors"
              title="Editar cliente"
            >
              <Pencil size={20} color="blue" />
            </button>
          )}
        </ModalHeader>
        <ModalBody className="text-gray-500">
          <div className="w-full max-w-sm pb-4 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">Nome</label>
              <p className="text-gray-800 font-medium">{client?.name}</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">Email</label>
              <p className="text-gray-800 font-medium">{client?.email}</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">Endereço</label>
              <p className="text-gray-800 font-medium">{client?.address}</p>
            </div>

            {client?.observations && (
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800">
                  Observações
                </label>
                <p className="text-gray-800 font-medium">{client.observations}</p>
              </div>
            )}

            {client?.createdAt && (
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <label className="block text-xs font-bold text-gray-700">Criado em</label>
                <p className="text-gray-600 text-sm">
                  {new Date(client.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            )}
          </div>
        </ModalBody>
      </>
    </ModalComponent>
  );
}
