import { Sale, SaleRequestData } from "@/app/interfaces/sales";
import { apiFetch } from "@/app/shared/requests";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UseSalesParams {
  skip: number;
  createdAt?: string;
}

interface UseProductsReturn {
  sales: Sale[];
  pages: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useSales({ skip, createdAt }: UseSalesParams): UseProductsReturn {
  const [sales, setSales] = useState<Sale[]>([]);
  const [pages, setPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSales = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiFetch<SaleRequestData>(
        `/sales?skip=${skip}&createdAt=${createdAt}`,
        "GET",
      );
      setPages(response.data.pages);
      setSales(response.data.sales || []);
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.log(error);
      toast.error("Erro ao carregar produtos");
      setSales([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [skip, createdAt]);

  return {
    sales,
    pages,
    isLoading,
    error,
    refetch: fetchSales,
  };
}