"use client";
import { Product } from "@/app/interfaces/product";
import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { Pagination } from "@nextui-org/pagination";
import AddProductModal from "./components/AddProductModal";
import DetailsModal from "./components/DetailsModal";
import { MagnifyingGlass } from "phosphor-react";
import { useDebounce } from "@/app/hooks/useDebounce";
import { useProducts } from "@/app/hooks/useProducts";

export default function ProductsPage() {
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Product | undefined>();
  const [productDetail, setProductDetail] = useState<Product | undefined>();
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [pageType, setPageType] = useState<"add" | "edit">();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState<string>("menor");

  const debouncedSearchTerm = useDebounce({
    value: searchTerm,
    delay: 1000,
  }) as string;

  const { products, pages, isLoading, refetch } = useProducts({
    skip,
    searchTerm: debouncedSearchTerm,
    filterOption,
  });

  const handleOpenEditModal = (productData: Product) => {
    setEditData(productData);
    setPageType("edit");
    setIsModalOpen(true);
  };

  const handleOpenDetailsModal = (productData: Product) => {
    setProductDetail(productData);
    setIsOpenDetailsModal(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSkip((page - 1) * 8);
  };

  return (
    <div className="bg-gray-200 w-full h-full p-4 flex flex-col relative">
      <div className="w-full flex justify-between items-center mb-4 gap-2">
        <h1 className="text-3xl font-bold text-gray-800">Produtos</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center mr-4">
            <label className="mr-2 text-black">Ordenar por:</label>
            <select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              className="border rounded-lg p-2 text-gray-600 hover:cursor-pointer"
            >
              <option value="menor">Menor estoque</option>
              <option value="maior">Maior estoque</option>
              <option value="sem">Sem estoque</option>
            </select>
          </div>
          <div className="flex relative">
            <input
              type="text"
              placeholder="Buscar produto"
              className="border rounded-lg p-2 mr-4 text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MagnifyingGlass className="absolute right-6 top-2" size={26} color="gray" />
          </div>

          <button
            onClick={() => {
              setPageType("add");
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
          >
            Adicionar Produto
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-600 text-lg">Carregando produtos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full max-h-screen overflow-auto">
          {products?.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              handleOpenEdit={() => handleOpenEditModal(product)}
              handleOpenDetails={() => handleOpenDetailsModal(product)}
            />
          ))}
        </div>
      )}

      <div className="mt-4 2xl:mt-0 w-full flex items-center justify-center bg-transparent">
        <Pagination
          variant="flat"
          showControls
          isDisabled={pages === 1}
          page={currentPage}
          total={pages}
          onChange={(page: number) => handlePageChange(page)}
        />
      </div>

      <AddProductModal
        pageType={pageType}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editData}
        refetch={refetch}
      />

      <DetailsModal
        isOpen={isOpenDetailsModal}
        onClose={() => setIsOpenDetailsModal(false)}
        product={productDetail}
      />
    </div>
  );
}
