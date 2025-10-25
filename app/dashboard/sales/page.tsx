"use client";
import React, { useState } from "react";
import { Pagination } from "@nextui-org/pagination";
import SalesTable from "./components/SalesTable";
import { useSales } from "@/app/hooks/useSales";

export default function SalesPage() {
  const [skip, setSkip] = useState(0);
  const [createdAt, setCreatedAt] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);

 const {sales, pages, refetch} = useSales({skip, createdAt})

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSkip((page - 1) * 30);
  };

  return (
    <div className="bg-gray-200 w-full h-full p-4 flex flex-col relative">
      <div className="w-full flex justify-end items-center mb-4">
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
        >
          Adicionar Venda
        </button>
      </div>
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full max-h-screen overflow-auto">
        {data?.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div> */}
      <div className="flex items-center justify-center">
        <SalesTable sales={sales ?? []} onClick={(e) => console.log(e)} />
      </div>
      <div className="mt-4 w-full flex items-center justify-center bg-transparent">
        <Pagination
          variant="flat"
          showControls
          isDisabled={pages === 1}
          page={currentPage}
          total={pages}
          onChange={(page: number) => handlePageChange(page)}
        />
      </div>

      {/* <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <DetailsModal
        isOpen={isOpenDetailsModal}
        onClose={() => setIsOpenDetailsModal(false)}
        product={productDetail}
      /> */}
    </div>
  );
}
