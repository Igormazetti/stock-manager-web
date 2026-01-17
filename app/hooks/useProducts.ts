import { Product, ProductRequestData } from "@/app/interfaces/product";
import { apiFetch } from "@/app/shared/requests";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";

interface UseProductsParams {
  skip: number;
  searchTerm: string;
  filterOption: string;
}

interface UseProductsReturn {
  products: Product[];
  pages: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

async function fetchProducts(skip: number, searchTerm: string, filterOption: string) {
  const response = await apiFetch<ProductRequestData>(
    `/products?skip=${skip}&take=8&name=${searchTerm}&order=${filterOption}`,
    "GET",
  );
  return response.data;
}

export function useProducts({
  skip,
  searchTerm,
  filterOption,
}: UseProductsParams): UseProductsReturn {
  const queryClient = useQueryClient();
  const errorShownRef = useRef(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", skip, searchTerm, filterOption],
    queryFn: () => fetchProducts(skip, searchTerm, filterOption),
  });

  useEffect(() => {
    if (error && !errorShownRef.current) {
      errorShownRef.current = true;
      toast.error("Erro ao carregar produtos");
    }
    if (!error) {
      errorShownRef.current = false;
    }
  }, [error]);

  const refetch = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["products"] });
  }, [queryClient]);

  return {
    products: data?.products || [],
    pages: data?.pages || 0,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
