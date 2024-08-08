"use client";
import { Product } from "@/app/interfaces/product";
import { apiFetch } from "@/app/shared/requests";
import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import ProductCard from "./components/ProductCard";
import { Pagination } from "@nextui-org/pagination";
import AddProductModal from "./components/AddProductModal";
import { useQuery } from "@tanstack/react-query";

export default function ProductsPage() {
  const [skip, setSkip] = useState(0);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getProducts = useCallback(async () => {
    try {
      const response = await apiFetch<any>(`/products?skip=${skip}&take=8`, "GET");
      console.log(response.data);
      setProducts(response.data.products);
      setPages(response.data.pages);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao carregar produtos");
    }
  }, [skip]);

  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await getProducts(),
    queryKey: ["products"],
    refetchInterval: 1000 * 60 * 30, //3min
    staleTime: 1000 * 60 * 30,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSkip((page - 1) * 8);
  };

  useEffect(() => {
    getProducts();
  }, [getProducts]);

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
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-4 w-full flex items-center justify-center">
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
