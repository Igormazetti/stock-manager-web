"use client";
import { Product } from "@/app/interfaces/product";
import { apiFetch } from "@/app/shared/requests";
import React, { useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "./components/ProductCard";
import { Pagination } from "@nextui-org/pagination";
import AddProductModal from "./components/AddProductModal";
import { useQuery } from "react-query";

export default function ProductsPage() {
  const [skip, setSkip] = useState(0);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<Product | null>();

  const { data } = useQuery<Product[]>(["solicitations", skip], () => getProducts(), {
    staleTime: 1000 * 60 * 3,
    refetchInterval: 1000 * 60 * 3,
  });

  const getProducts = async () => {
    try {
      const response = await apiFetch<any>(`/products?skip=${skip}&take=8`, "GET");
      setPages(response.data.pages);
      return response.data.products || [];
    } catch (error) {
      console.log(error);
      toast.error("Erro ao carregar produtos");
    }
  };

  const handleOpenEditModal = (productData: Product) => {
    setEditData(productData);
    setIsEditModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSkip((page - 1) * 8);
  };

  return (
    <div className="bg-gray-200 w-full h-full p-4 flex flex-col relative">
      <div className="w-full flex justify-end items-center mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
        >
          Adicionar Produto
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full max-h-screen overflow-auto">
        {data?.map((product: Product) => (
          <ProductCard key={product.id} product={product} handleOpenEdit={() => handleOpenEditModal(product)} />
        ))}
      </div>
      <div className="mt-0 w-full flex items-center justify-center bg-transparent">
        <Pagination
          variant="flat"
          showControls
          isDisabled={pages === 1}
          page={currentPage}
          total={pages}
          onChange={(page: number) => handlePageChange(page)}
        />
      </div>

      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
