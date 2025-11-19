import { Sale, SaleRequestData } from "@/app/interfaces/sales";
import { apiFetch } from "@/app/shared/requests";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UseSalesParams {
  skip: number;
  createdAt?: string;
  clientName?: string;
  product?: string;
  paid?: boolean;
  paymentTimeStart?: string;
  paymentTimeEnd?: string;
}

interface UseProductsReturn {
  sales: Sale[];
  pages: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useSales({ skip, createdAt, clientName, product, paid, paymentTimeStart, paymentTimeEnd }: UseSalesParams): UseProductsReturn {
  const [sales, setSales] = useState<Sale[]>([]);
  const [pages, setPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSales = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("skip", skip.toString());
      if (createdAt) params.append("createdAt", createdAt);
      if (clientName) params.append("clientName", clientName);
      if (product) params.append("product", product);
      if (paid !== undefined) params.append("paid", paid.toString());
      if (paymentTimeStart) params.append("paymentTimeStart", paymentTimeStart);
      if (paymentTimeEnd) params.append("paymentTimeEnd", paymentTimeEnd);

      const response = await apiFetch<SaleRequestData>(
        `/sales?${params.toString()}`,
        "GET",
      );
      setPages(response.data.pages);
      setSales(response.data.sales || []);
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.log(error);
      toast.error("Erro ao carregar vendas");
      setSales([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [skip, createdAt, clientName, product, paid, paymentTimeStart, paymentTimeEnd]);

  return {
    sales,
    pages,
    isLoading,
    error,
    refetch: fetchSales,
  };
}