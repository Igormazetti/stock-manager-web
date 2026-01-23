"use client";
import { Sale } from "@/app/interfaces/sales";
import ModalComponent from "@/app/components/Modal/Modal";
import { ModalBody, ModalHeader } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { formatDate } from "@/app/utils/dateFormatter";
import { apiFetch } from "@/app/shared/requests";
import toast from "react-hot-toast";

interface CobrancasDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | undefined;
  onSaleUpdated?: () => Promise<void>;
}

export default function CobrancasDetailsModal({
  isOpen,
  onClose,
  sale,
  onSaleUpdated,
}: CobrancasDetailsModalProps) {
  const [paymentTime, setPaymentTime] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setPaymentTime("");
  }, [sale]);

  if (!sale) return null;

  const clientName = sale.Client?.name || sale.client;
  const discount = (sale as any).discount || 0;
  const subtotal = (sale as any).subtotal || sale.totalValue + discount;

  const handleMarkAsPaid = async () => {
    setIsUpdating(true);
    try {
      await apiFetch(`/sales/${sale.id}`, "PATCH", {
        paid: true,
        ...(paymentTime && { paymentTime }),
      });
      toast.success("Venda marcada como paga!");
      if (onSaleUpdated) {
        await onSaleUpdated();
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao atualizar status de pagamento");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ModalComponent isOpen={isOpen} size="3xl" onClose={onClose}>
      <>
        <ModalHeader className="flex flex-col gap-1 text-gray-600 w-full text-center">
          Detalhes da Cobrança
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
                  <p className="text-xs text-gray-600">Data da Venda</p>
                  <p className="font-medium text-gray-800">
                    {formatDate(sale.createdAt)}
                  </p>
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
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {sale.Products && sale.Products.length > 0 ? (
                  sale.Products.map((saleProduct) => {
                    const salePrice =
                      saleProduct.productSaleValue ?? saleProduct.Product.value;
                    return (
                      <div
                        key={saleProduct.id}
                        className="bg-white p-3 rounded border border-gray-200 flex justify-between items-center"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {saleProduct.Product.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {saleProduct.quantity_sold} un. x R$ {salePrice.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-bold text-blue-600">
                          R$ {(salePrice * saleProduct.quantity_sold).toFixed(2)}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    Nenhum produto nesta venda
                  </p>
                )}
              </div>
            </div>

            {/* Total - Highlighted */}
            <div className="mb-6 bg-yellow-50 p-5 rounded-lg border-2 border-yellow-300">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-600">Subtotal:</p>
                <p className="text-sm font-medium text-gray-800">
                  R$ {subtotal.toFixed(2)}
                </p>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">Desconto:</p>
                  <p className="text-sm font-medium text-green-600">
                    -R$ {discount.toFixed(2)}
                  </p>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-yellow-300">
                <p className="text-lg font-bold text-gray-800">Valor Pendente:</p>
                <p className="text-3xl font-bold text-yellow-600">
                  R$ {sale.totalValue.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-green-50 p-5 rounded-lg border-2 border-green-300">
              <h3 className="font-semibold text-gray-800 mb-4">Confirmar Pagamento</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data e Hora do Pagamento (Opcional)
                </label>
                <input
                  type="datetime-local"
                  value={paymentTime}
                  onChange={(e) => setPaymentTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Se deixado em branco, será usada a data e hora atual
                </p>
              </div>

              <button
                onClick={handleMarkAsPaid}
                disabled={isUpdating}
                className="w-full bg-green-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {isUpdating ? "Processando..." : "✓ Marcar como Pago"}
              </button>
            </div>
          </div>
        </ModalBody>
      </>
    </ModalComponent>
  );
}
