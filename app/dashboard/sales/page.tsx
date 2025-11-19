"use client";
import React, { useState } from "react";
import { Pagination } from "@nextui-org/pagination";
import SalesTable from "./components/SalesTable";
import AddSaleModal from "./components/AddSaleModal";
import SalesDetailsModal from "./components/SalesDetailsModal";
import SalesFilterModal, { SalesFilters } from "./components/SalesFilterModal";
import { useSales } from "@/app/hooks/useSales";
import { Sale } from "@/app/interfaces/sales";
import { FunnelSimple } from "phosphor-react";

export default function SalesPage() {
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | undefined>();

  const [filters, setFilters] = useState<SalesFilters>({
    clientName: undefined,
    product: undefined,
    createdAt: undefined,
    paid: undefined,
    paymentTimeStart: undefined,
    paymentTimeEnd: undefined,
  });

  const { sales, pages, refetch } = useSales({
    skip,
    clientName: filters.clientName,
    product: filters.product,
    createdAt: filters.createdAt,
    paid: filters.paid,
    paymentTimeStart: filters.paymentTimeStart,
    paymentTimeEnd: filters.paymentTimeEnd,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSkip((page - 1) * 30);
  };

  const handleApplyFilters = (newFilters: SalesFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setSkip(0);
  };

  const handleSaleClick = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="bg-gray-200 w-full h-full p-4 flex flex-col relative">
      <div className="w-full flex justify-between items-center mb-4 gap-2">
        <h1 className="text-3xl font-bold text-gray-800">Vendas</h1>
        <div className="flex gap-2">
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-200 ease-in-out flex items-center gap-2"
        >
          <FunnelSimple size={20} />
          Filtros
        </button>
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
        >
          Adicionar Venda
        </button>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <SalesTable sales={sales ?? []} onClick={handleSaleClick} />
      </div>
      <div className="mt-4 w-full flex items-center justify-center bg-transparent">
        <Pagination
          variant="flat"
          showControls
          isDisabled={!pages || pages <= 1}
          page={currentPage}
          total={pages}
          onChange={(page: number) => handlePageChange(page)}
        />
      </div>

      <AddSaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refetch={refetch}
      />

      <SalesDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        sale={selectedSale}
        onSaleUpdated={refetch}
      />

      <SalesFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </div>
  );
}
