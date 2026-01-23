"use client";
import React, { useState } from "react";
import { Pagination } from "@nextui-org/pagination";
import { MagnifyingGlass } from "phosphor-react";
import CobrancasTable from "./components/CobrancasTable";
import CobrancasDetailsModal from "./components/CobrancasDetailsModal";
import { useSales } from "@/app/hooks/useSales";
import { Sale } from "@/app/interfaces/sales";
import { useDebounce } from "@/app/hooks/useDebounce";

export default function CobrancasPage() {
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | undefined>();
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce({
    value: searchTerm,
    delay: 500,
  }) as string;

  const { sales, pages, refetch } = useSales({
    skip,
    clientName: debouncedSearchTerm || undefined,
    paid: false,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSkip((page - 1) * 30);
  };

  const handleSaleClick = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDetailsModalOpen(true);
  };

  const handleSaleUpdated = async () => {
    await refetch();
    setIsDetailsModalOpen(false);
  };

  return (
    <div className="bg-gray-200 w-full h-full p-4 flex flex-col relative">
      <div className="w-full flex justify-between items-center mb-4 gap-2">
        <h1 className="text-3xl font-bold text-gray-800">Cobranças</h1>
        <div className="flex relative">
          <input
            type="text"
            placeholder="Buscar por cliente..."
            className="border rounded-lg p-2 pr-10 text-black w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
              setSkip(0);
            }}
          />
          <MagnifyingGlass className="absolute right-3 top-2.5" size={22} color="gray" />
        </div>
      </div>

      <div className="flex items-center justify-center">
        <CobrancasTable sales={sales ?? []} onClick={handleSaleClick} />
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

      <CobrancasDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        sale={selectedSale}
        onSaleUpdated={handleSaleUpdated}
      />
    </div>
  );
}
