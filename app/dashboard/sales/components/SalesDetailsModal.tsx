"use client";
import { Sale } from "@/app/interfaces/sales";
import ModalComponent from "@/app/components/Modal/Modal";
import { ModalBody, ModalHeader } from "@nextui-org/react";
import React from "react";
import { formatDate } from "@/app/utils/dateFormatter";

interface SalesDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | undefined;
}

export default function SalesDetailsModal({ isOpen, onClose, sale }: SalesDetailsModalProps) {
  if (!sale) return null;

  const clientName = sale.Client?.name || sale.client;
  const discount = (sale as any).discount || 0;
  const subtotal = (sale as any).subtotal || sale.totalValue + discount;

  return (
    <ModalComponent isOpen={isOpen} size="3xl" onClose={onClose}>
      <>
        <ModalHeader className="flex flex-col gap-1 text-gray-600 w-full text-center">
          Detalhes da Venda
        </ModalHeader>
        <ModalBody className="text-gray-500 max-h-[80vh] overflow-y-auto">
          <div className="w-full pb-4">
            {/* Client Information */}
            <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-3">Informações do Cliente</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600">Nome</p>
                  <p className="font-medium text-gray-800">{clientName}</p>
                </div>
                {sale.Client && (
                  <>
                    <div>
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="font-medium text-gray-800">{sale.Client.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Endereço</p>
                      <p className="font-medium text-gray-800">{sale.Client.address}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sale Information */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">Informações da Venda</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-xs text-gray-600">ID</p>
                  <p className="font-mono text-xs text-gray-800">{sale.id}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-xs text-gray-600">Data</p>
                  <p className="font-medium text-gray-800">{formatDate(sale.createdAt)}</p>
                </div>
                {sale.observation && (
                  <div className="pt-2 border-t border-gray-300">
                    <p className="text-xs text-gray-600 mb-1">Observação</p>
                    <p className="text-base text-black bg-yellow-50 p-3 rounded border border-yellow-200 font-medium">
                      {sale.observation}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Products */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Produtos</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {sale.Products && sale.Products.length > 0 ? (
                  sale.Products.map((saleProduct) => (
                    <div
                      key={saleProduct.id}
                      className="bg-white p-4 rounded border border-gray-200"
                    >
                      {/* Product Header: Name, Unit Price, and Quantity */}
                      <div className="flex justify-between items-center gap-3 mb-2">
                        <p className="font-medium text-gray-800 text-base flex-1">
                          {saleProduct.Product.title}
                        </p>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Preço Unit.</p>
                          <p className="text-sm font-semibold text-gray-800">
                            R$ {saleProduct.Product.value.toFixed(2)}
                          </p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
                          {saleProduct.quantity_sold} un.
                        </span>
                      </div>

                      {/* Product Description */}
                      <p className="text-sm text-gray-500 mb-3">
                        {saleProduct.Product.description}
                      </p>

                      {/* Subtotal */}
                      <div className="flex justify-end items-end gap-3 pt-3 border-t border-gray-100">
                        <div className="text-right">
                          <p className="text-xs text-gray-600 mb-1">Subtotal</p>
                          <p className="text-lg font-bold text-blue-600">
                            R$ {(saleProduct.Product.value * saleProduct.quantity_sold).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">Nenhum produto nesta venda</p>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 overflow-hidden">
              <div className="p-3 border-b border-blue-200">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-700">Subtotal:</p>
                  <p className="text-sm font-semibold text-gray-800">
                    R$ {subtotal.toFixed(2)}
                  </p>
                </div>
              </div>
              {discount > 0 && (
                <div className="p-3 border-b border-blue-200 bg-green-50">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-700">Desconto:</p>
                    <p className="text-sm font-semibold text-green-600">
                      -R$ {discount.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
              <div className="p-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-700">Total:</p>
                  <p className="text-3xl font-bold text-blue-600">
                    R$ {sale.totalValue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </>
    </ModalComponent>
  );
}
