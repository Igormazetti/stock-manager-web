"use client";
import React, { useState } from "react";
import ModalComponent from "@/app/components/Modal/Modal";
import { ModalBody, ModalHeader } from "@nextui-org/react";
import toast from "react-hot-toast";

interface SalesFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: SalesFilters) => void;
  currentFilters: SalesFilters;
}

export interface SalesFilters {
  clientName?: string;
  product?: string;
  createdAt?: string;
  paid?: boolean;
  paymentTimeStart?: string;
  paymentTimeEnd?: string;
}

export default function SalesFilterModal({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
}: SalesFilterModalProps) {
  const [clientName, setClientName] = useState(currentFilters.clientName || "");
  const [product, setProduct] = useState(currentFilters.product || "");
  const [createdAt, setCreatedAt] = useState(currentFilters.createdAt || "");
  const [paid, setPaid] = useState<boolean | undefined>(currentFilters.paid);
  const [paymentTimeStart, setPaymentTimeStart] = useState(currentFilters.paymentTimeStart || "");
  const [paymentTimeEnd, setPaymentTimeEnd] = useState(currentFilters.paymentTimeEnd || "");

  const handleClose = () => {
    onClose();
  };

  const handleReset = () => {
    setClientName("");
    setProduct("");
    setCreatedAt("");
    setPaid(undefined);
    setPaymentTimeStart("");
    setPaymentTimeEnd("");
    onApplyFilters({
      clientName: undefined,
      product: undefined,
      createdAt: undefined,
      paid: undefined,
      paymentTimeStart: undefined,
      paymentTimeEnd: undefined,
    });
    toast.success("Filtros resetados!");
    onClose();
  };

  const handleApply = () => {
    const filters: SalesFilters = {};

    if (clientName.trim()) filters.clientName = clientName.trim();
    if (product.trim()) filters.product = product.trim();
    if (createdAt.trim()) filters.createdAt = createdAt.trim();
    if (paid !== undefined) filters.paid = paid;
    if (paymentTimeStart.trim()) filters.paymentTimeStart = paymentTimeStart.trim();
    if (paymentTimeEnd.trim()) filters.paymentTimeEnd = paymentTimeEnd.trim();

    onApplyFilters(filters);
    toast.success("Filtros aplicados!");
    onClose();
  };

  return (
    <ModalComponent isOpen={isOpen} size="3xl" onClose={handleClose}>
      <>
        <ModalHeader className="flex flex-col gap-1 text-gray-600 w-full text-center">
          Filtros de Vendas
        </ModalHeader>
        <ModalBody className="text-gray-500 max-h-[80vh] overflow-y-auto">
          <form className="w-full pb-4 space-y-4">
            {/* Client Name Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Buscar por nome do cliente..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Busca parcial e case-insensitive
              </p>
            </div>

            {/* Product Name Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Produto
              </label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Buscar por nome do produto..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Busca parcial e case-insensitive
              </p>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data
              </label>
              <input
                type="date"
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Filtra vendas por data específica
              </p>
            </div>

            {/* Payment Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status de Pagamento
              </label>
              <select
                value={paid === undefined ? "" : paid ? "true" : "false"}
                onChange={(e) => {
                  if (e.target.value === "") setPaid(undefined);
                  else setPaid(e.target.value === "true");
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="true">Pago</option>
                <option value="false">Pendente</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Filtra vendas por status de pagamento
              </p>
            </div>

            {/* Payment Time Start Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Pagamento - De
              </label>
              <input
                type="date"
                value={paymentTimeStart}
                onChange={(e) => setPaymentTimeStart(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Data inicial do período de pagamento
              </p>
            </div>

            {/* Payment Time End Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Pagamento - Até
              </label>
              <input
                type="date"
                value={paymentTimeEnd}
                onChange={(e) => setPaymentTimeEnd(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Data final do período de pagamento
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
              >
                Resetar
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                Aplicar Filtros
              </button>
            </div>
          </form>
        </ModalBody>
      </>
    </ModalComponent>
  );
}
