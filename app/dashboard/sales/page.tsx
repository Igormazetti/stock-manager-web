"use client";
import { Sale, SaleRequestData } from "@/app/interfaces/sales";
import { apiFetch } from "@/app/shared/requests";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Pagination } from "@nextui-org/pagination";
import { useQuery } from "react-query";
import SalesTable from "./components/SalesTable";

export default function SalesPage() {
  const [skip, setSkip] = useState(0);
  const [pages, setPages] = useState(0);
  const [createdAt, setCreatedAt] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);

  const { data } = useQuery<Sale[]>(["sales", skip, createdAt], () => getProducts(), {
    staleTime: 1000 * 60 * 3,
    refetchInterval: 1000 * 60 * 3,
  });

  const getProducts = async (): Promise<Sale[]> => {
    try {
      const response = await apiFetch<SaleRequestData>(
        `/sales?skip=${skip}&createdAt=${createdAt}`,
        "GET",
      );
      setPages(response.data.pages);
      return response.data.sales || [];
    } catch (error) {
      console.log(error);
      toast.error("Erro ao carregar produtos");
      return [];
    }
  };

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
        <SalesTable sales={data ?? []} onClick={(e) => console.log(e)} />
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
