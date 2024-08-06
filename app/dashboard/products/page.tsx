"use client";
import { Product, ProductRequestData } from "@/app/interfaces/product";
import { apiFetch } from "@/app/shared/requests";
import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import ProductCard from "./components/ProductCard";

export default function ProductsPage() {
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(8);
  const [products, setProducts] = useState<Product[]>([]);

  const getProducts = useCallback(async () => {
    try {
      const response = await apiFetch<any>(`/products?skip=${skip}&take=${take}`, "GET");

      setProducts(response.products);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao carregar produtos");
    }
  }, [skip, take]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <div className="bg-gray-200 w-full h-full p-4 flex flex-col">
      <div className="w-full flex justify-end items-center mb-4">
        <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out">
          Adicionar Produto
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-screen overflow-auto">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
