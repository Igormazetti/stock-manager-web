"use client";
import { Product } from "@/app/interfaces/product";
import { apiFetch } from "@/app/shared/requests";
import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(6);
  const [products, setProducts] = useState<Product[]>([]);

  const getProducts = useCallback(async () => {
    try {
      const response = await apiFetch<Product[]>(`/products?skip=${skip}&take=${take}`, "GET");
      setProducts(response);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao carregar produtos");
    }
  }, [skip, take]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return <div className="bg-gray-200 w-full h-full">Produtos</div>;
}
