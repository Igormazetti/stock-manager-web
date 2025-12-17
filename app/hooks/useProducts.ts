import { Product, ProductRequestData } from "@/app/interfaces/product";
import { apiFetch } from "@/app/shared/requests";
import { useEffect, useState } from "react";
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

export function useProducts({
  skip,
  searchTerm,
  filterOption,
}: UseProductsParams): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [pages, setPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFetch<ProductRequestData>(
        `/products?skip=${skip}&take=8&name=${searchTerm}&order=${filterOption}`,
        "GET",
      );
      setPages(response.data.pages);
      setProducts(response.data.products || []);
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.log(error);
      toast.error("Erro ao carregar produtos");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, searchTerm, filterOption]);

  return {
    products,
    pages,
    isLoading,
    error,
    refetch: fetchProducts,
  };
}
