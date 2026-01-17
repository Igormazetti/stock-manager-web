"use client";
import { Sale } from "@/app/interfaces/sales";
import ModalComponent from "@/app/components/Modal/Modal";
import { ModalBody, ModalHeader } from "@nextui-org/react";
import React, { useState, useRef, useEffect } from "react";
import { formatDate } from "@/app/utils/dateFormatter";
import { apiFetch } from "@/app/shared/requests";
import toast from "react-hot-toast";
import { SalePrintReceipt, CompanyData } from "./SalePrintReceipt";
import { Printer } from "phosphor-react";
import { useReactToPrint } from "react-to-print";

interface SalesDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | undefined;
  onSaleUpdated?: () => Promise<void>;
}

export default function SalesDetailsModal({
  isOpen,
  onClose,
  sale,
  onSaleUpdated,
}: SalesDetailsModalProps) {
  const [isPaid, setIsPaid] = useState((sale as any)?.paid || false);
  const [paymentTime, setPaymentTime] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [printDateTime, setPrintDateTime] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ((sale as any)?.paymentTime) {
      const isoTime = (sale as any).paymentTime;
      const date = new Date(isoTime);
      const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setPaymentTime(localDateTime);
    } else {
      setPaymentTime("");
    }
    setIsPaid((sale as any)?.paid || false);
  }, [sale]);

  const fetchCompanyData = async () => {
    try {
      const response = await apiFetch<{ status: number; company: CompanyData }>(
        "/company",
        "GET",
      );
      setCompanyData((response as any).data.company);
    } catch (error) {
      console.log("Error fetching company data:", error);
    }
  };

  const formatPrintDateTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  const handlePrintClick = async () => {
    await fetchCompanyData();
    setPrintDateTime(formatPrintDateTime());
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Venda-${sale?.id.slice(0, 8)}`,
  });

  if (!sale) return null;

  const clientName = sale.Client?.name || sale.client;
  const discount = (sale as any).discount || 0;
  const subtotal = (sale as any).subtotal || sale.totalValue + discount;

  const handleUpdatePaidStatus = async () => {
    setIsUpdating(true);
    try {
      await apiFetch(`/sales/${sale.id}`, "PATCH", {
        paid: isPaid,
        ...(isPaid && paymentTime && { paymentTime }),
      });
      toast.success("Status de pagamento atualizado!");
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
    <>
      {/* Hidden Print Component */}
      <div style={{ display: "none" }}>
        <SalePrintReceipt
          ref={printRef}
          sale={sale}
          companyData={companyData}
          printDateTime={printDateTime}
        />
      </div>

      <ModalComponent isOpen={isOpen} size="3xl" onClose={onClose}>
        <>
          <ModalHeader className="flex flex-row gap-2 text-gray-600 w-full justify-between items-center px-6">
            <span className="flex-1 text-center">Detalhes da Venda</span>
            <button
              onClick={handlePrintClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 mr-4 rounded-lg shadow-md transition duration-200 flex items-center gap-2"
              title="Imprimir Venda"
            >
              <Printer size={20} />
              Imprimir
            </button>
          </ModalHeader>
          <ModalBody className="text-gray-500 max-h-[80vh] overflow-y-auto">
            <div className="w-full pb-4">
              {/* Client Information */}
              <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Informações do Cliente
                </h3>
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

              {/* Payment Status */}
              <div
                className="mb-6 rounded-lg p-5 border-2"
                style={{
                  borderColor: isPaid ? "#10b981" : "#f59e0b",
                  backgroundColor: isPaid ? "#f0fdf4" : "#fffbf0",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Status de Pagamento</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isPaid
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {isPaid ? "✓ PAGO" : "PENDENTE"}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsPaid(true)}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 border-2 ${
                        isPaid
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-green-600 border-green-300 hover:border-green-600"
                      }`}
                    >
                      ✓ Marcar como Pago
                    </button>
                    <button
                      onClick={() => setIsPaid(false)}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 border-2 ${
                        !isPaid
                          ? "bg-yellow-600 text-white border-yellow-600"
                          : "bg-white text-yellow-600 border-yellow-300 hover:border-yellow-600"
                      }`}
                    >
                      ✗ Marcar como Não Pago
                    </button>
                  </div>

                  {isPaid && (
                    <div className="bg-white rounded-lg p-4 border border-green-200">
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
                        Se deixado em branco, será usado a data e hora atual
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleUpdatePaidStatus}
                    disabled={isUpdating}
                    className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? "Atualizando..." : "Salvar Alterações"}
                  </button>
                </div>
              </div>

              {/* Products */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Produtos</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {sale.Products && sale.Products.length > 0 ? (
                    sale.Products.map((saleProduct) => {
                      const salePrice =
                        saleProduct.productSaleValue ?? saleProduct.Product.value;
                      const priceChanged =
                        saleProduct.productSaleValue &&
                        saleProduct.productSaleValue !== saleProduct.Product.value;
                      return (
                        <div
                          key={saleProduct.id}
                          className="bg-white p-4 rounded border border-gray-200"
                        >
                          {/* Product Header: Name and Quantity */}
                          <div className="flex justify-between items-start gap-3 mb-3">
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 text-base">
                                {saleProduct.Product.title}
                              </p>
                              {saleProduct.Product.code && (
                                <p className="text-xs text-blue-600 font-semibold">
                                  Código: {saleProduct.Product.code}
                                </p>
                              )}
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
                              {saleProduct.quantity_sold} un.
                            </span>
                          </div>

                          {/* Product Description */}
                          <p className="text-sm text-gray-500 mb-3">
                            {saleProduct.Product.description}
                          </p>

                          {/* Price Information */}
                          <div className="bg-gray-50 p-3 rounded mb-3 border border-gray-100">
                            <div className="flex justify-between items-center gap-4">
                              <div>
                                <p className="text-xs text-gray-600 mb-1">
                                  Preço Original
                                </p>
                                <p className="text-sm font-semibold text-gray-800">
                                  R$ {saleProduct.Product.value.toFixed(2)}
                                </p>
                              </div>
                              <div
                                className={
                                  priceChanged ? "border-l-2 border-yellow-400 pl-4" : ""
                                }
                              >
                                <p className="text-xs text-gray-600 mb-1">
                                  Preço de Venda
                                </p>
                                <p
                                  className={`text-sm font-semibold ${priceChanged ? "text-yellow-600" : "text-gray-800"}`}
                                >
                                  R$ {salePrice.toFixed(2)}
                                </p>
                                {priceChanged && (
                                  <p
                                    className={`text-xs mt-1 font-semibold ${salePrice > saleProduct.Product.value ? "text-green-600" : "text-red-600"}`}
                                  >
                                    {salePrice > saleProduct.Product.value
                                      ? `+R$ ${(salePrice - saleProduct.Product.value).toFixed(2)}`
                                      : `-R$ ${(saleProduct.Product.value - salePrice).toFixed(2)}`}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Subtotal */}
                          <div className="flex justify-end items-end gap-3 pt-3 border-t border-gray-100">
                            <div className="text-right">
                              <p className="text-xs text-gray-600 mb-1">Subtotal</p>
                              <p className="text-lg font-bold text-blue-600">
                                R$ {(salePrice * saleProduct.quantity_sold).toFixed(2)}
                              </p>
                            </div>
                          </div>
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
    </>
  );
}
