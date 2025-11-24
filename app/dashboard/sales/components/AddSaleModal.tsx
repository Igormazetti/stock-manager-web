"use client";
import { Client } from "@/app/interfaces/client";
import { Product } from "@/app/interfaces/product";
import { useClients } from "@/app/hooks/useClients";
import { useProducts } from "@/app/hooks/useProducts";
import { useNotifications } from "@/app/hooks/useNotifications";
import { apiFetch } from "@/app/shared/requests";
import ModalComponent from "@/app/components/Modal/Modal";
import { ModalBody, ModalHeader, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { X } from "phosphor-react";

interface AddSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => Promise<void>;
}

interface SelectedProduct {
  productId: string;
  productTitle: string;
  quantity: number;
  value: number;
  productSaleValue: number;
}

interface FormData {
  clientId: string;
  paid?: boolean;
  paymentTime?: string;
  observation?: string;
  products: {
    id: string;
    quantity: number;
    productSaleValue: number;
  }[];
}

export default function AddSaleModal({ isOpen, onClose, refetch }: AddSaleModalProps) {
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [observation, setObservation] = useState<string>("");
  const [isPaid, setIsPaid] = useState(false);
  const [paymentTime, setPaymentTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get notifications hook for refresh
  const { refreshNotifications } = useNotifications();

  // Fetch clients for autocomplete
  const { clients } = useClients({
    skip: 0,
    searchTerm: clientSearch,
  });

  // Fetch products for autocomplete
  const { products } = useProducts({
    skip: 0,
    searchTerm: productSearch,
    filterOption: "name",
  });

  const handleClose = () => {
    onClose();
    setClientSearch("");
    setSelectedClient(null);
    setProductSearch("");
    setSelectedProducts([]);
    setObservation("");
    setIsPaid(false);
    setPaymentTime("");
  };

  const handleSelectClient = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      setClientSearch("");
    }
  };

  const handleAddProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      // Check if product is already added
      if (selectedProducts.find((p) => p.productId === productId)) {
        toast.error("Produto já foi adicionado");
        return;
      }

      setSelectedProducts([
        ...selectedProducts,
        {
          productId: product.id,
          productTitle: product.title,
          quantity: 1,
          value: product.value,
          productSaleValue: product.value,
        },
      ]);
      setProductSearch("");
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.productId !== productId));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) return;
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.productId === productId ? { ...p, quantity } : p
      )
    );
  };

  const handlePriceChange = (productId: string, price: number) => {
    if (price < 0) return;
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.productId === productId ? { ...p, productSaleValue: price } : p
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClient) {
      toast.error("Selecione um cliente");
      return;
    }

    if (selectedProducts.length === 0) {
      toast.error("Adicione pelo menos um produto");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData: FormData = {
        clientId: selectedClient.id,
        products: selectedProducts.map((p) => ({
          id: p.productId,
          quantity: p.quantity,
          productSaleValue: p.productSaleValue,
        })),
        ...(observation.trim() && { observation: observation.trim() }),
        ...(isPaid && { paid: true, paymentTime: paymentTime || new Date().toISOString() }),
      };

      await apiFetch("/sales/create", "POST", formData);
      toast.success("Venda criada com sucesso!");
      await refetch();
      await refreshNotifications();
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error("Erro ao criar venda");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalValue = useMemo(
    () =>
      selectedProducts.reduce((total, product) => {
        return total + product.productSaleValue * product.quantity;
      }, 0),
    [selectedProducts]
  );

  return (
    <ModalComponent isOpen={isOpen} size="3xl" onClose={handleClose}>
      <>
        <ModalHeader className="flex flex-col gap-1 text-gray-600 w-full text-center">
          Adicionar Venda
        </ModalHeader>
        <ModalBody className="text-gray-500 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="w-full pb-4">
            {/* Client Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              {selectedClient ? (
                <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <span className="font-medium text-gray-800">{selectedClient.name}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedClient(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <Autocomplete
                  label="Buscar cliente"
                  placeholder="Digite o nome do cliente"
                  value={clientSearch}
                  onValueChange={setClientSearch}
                  className="w-full"
                  defaultItems={clients}
                  onSelectionChange={(key) => {
                    if (key) handleSelectClient(key.toString());
                  }}
                >
                  {clients.map((client) => (
                    <AutocompleteItem key={client.id} value={client.id} className="text-gray-800">
                      {client.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              )}
            </div>

            {/* Product Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Produtos *
              </label>
              <Autocomplete
                label="Buscar produto"
                placeholder="Digite o nome do produto"
                value={productSearch}
                onValueChange={setProductSearch}
                className="w-full"
                defaultItems={products}
                onSelectionChange={(key) => {
                  if (key) handleAddProduct(key.toString());
                }}
              >
                {products.map((product) => (
                  <AutocompleteItem key={product.id} value={product.id} className="text-gray-800">
                    {product.title}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>

            {/* Selected Products List */}
            {selectedProducts.length > 0 && (
              <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">Produtos Selecionados</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {selectedProducts.map((product) => (
                    <div
                      key={product.productId}
                      className="flex flex-col gap-2 bg-white p-3 rounded border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">
                            {product.productTitle}
                          </p>
                          <p className="text-xs text-gray-500">
                            Preço original: R$ {product.value.toFixed(2)} un.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(product.productId)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">
                            Preço de Venda (R$)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={product.productSaleValue}
                            onChange={(e) =>
                              handlePriceChange(
                                product.productId,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="w-20">
                          <label className="block text-xs text-gray-600 mb-1">
                            Qtd
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                product.productId,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600 mb-1">Total</p>
                          <p className="font-semibold text-gray-800 text-sm">
                            R$ {(product.productSaleValue * product.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Observation */}
            {selectedProducts.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observação (Opcional)
                </label>
                <textarea
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder="Digite observações sobre esta venda..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            )}


            {/* Payment Status */}
            {selectedProducts.length > 0 && (
              <div className="mb-4 rounded-lg p-5 border-2" style={{ borderColor: isPaid ? '#10b981' : '#d1d5db', backgroundColor: isPaid ? '#f0fdf4' : '#f9fafb' }}>
                <h3 className="font-semibold text-gray-800 mb-3">Status de Pagamento</h3>

                <div className="flex gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setIsPaid(true)}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 border-2 text-sm ${
                      isPaid
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-green-600 border-green-300 hover:border-green-600"
                    }`}
                  >
                    ✓ Marcar como Pago
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPaid(false)}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 border-2 text-sm ${
                      !isPaid
                        ? "bg-yellow-600 text-white border-yellow-600"
                        : "bg-white text-yellow-600 border-yellow-300 hover:border-yellow-600"
                    }`}
                  >
                    ✗ Marcar como Não Pago
                  </button>
                </div>

                {isPaid && (
                  <div className="bg-white rounded-lg p-3 border border-green-200">
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
                )}
              </div>
            )}

            {/* Total Value */}
            {selectedProducts.length > 0 && (
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-700">Total da Venda:</p>
                  <p className="text-3xl font-bold text-blue-600">
                    R$ {totalValue.toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !selectedClient || selectedProducts.length === 0}
              className="mt-4 bg-blue-600 w-full text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Criando venda..." : "Criar Venda"}
            </button>
          </form>
        </ModalBody>
      </>
    </ModalComponent>
  );
}
