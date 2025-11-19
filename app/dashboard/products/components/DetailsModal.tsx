import React from "react";
import ModalComponent from "@/app/components/Modal/Modal";
import { ModalBody } from "@nextui-org/react";

import { Product } from "@/app/interfaces/product";
import Image from "next/image";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

export default function DetailsModal({ isOpen, onClose, product }: AddProductModalProps) {
  return (
    <ModalComponent size="4xl" isOpen={isOpen} onClose={onClose}>
      <ModalBody className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2">
          {product?.imgUrl ? (
            <Image
              src={product.imgUrl || "/placeholder.png"}
              alt={product.title}
              width={20}
              height={20}
              layout="responsive"
              className="w-full object-contain rounded h-[200px]"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <span>Sem Imagem</span>
            </div>
          )}
        </div>

        <div className="md:w-1/2 p-4 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800">{product?.title}</h2>
          {product?.code && (
            <p className="text-gray-600 font-semibold">
              Código: <span className="text-blue-600">{product.code}</span>
            </p>
          )}
          <p className="text-gray-600">{product?.description}</p>
          <p className="text-gray-600 font-bold">Quantidade: {product?.quantity}</p>
          <p className="text-gray-800 font-bold">
            Valor:{" "}
            {product?.value.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
          <p className="text-gray-800 font-bold">
            Valor de custo:{" "}
            {product?.originalValue.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
      </ModalBody>
    </ModalComponent>
  );
}
