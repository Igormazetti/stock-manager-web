import { Sale, SaleRequestData } from "@/app/interfaces/sales";
import { apiFetch } from "@/app/shared/requests";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
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

interface UseSalesReturn {
  sales: Sale[];
  pages: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

async function fetchSales(params: UseSalesParams) {
  const searchParams = new URLSearchParams();
  searchParams.append("skip", params.skip.toString());
  if (params.createdAt) searchParams.append("createdAt", params.createdAt);
  if (params.clientName) searchParams.append("clientName", params.clientName);
  if (params.product) searchParams.append("product", params.product);
  if (params.paid !== undefined) searchParams.append("paid", params.paid.toString());
  if (params.paymentTimeStart)
    searchParams.append("paymentTimeStart", params.paymentTimeStart);
  if (params.paymentTimeEnd) searchParams.append("paymentTimeEnd", params.paymentTimeEnd);

  const response = await apiFetch<SaleRequestData>(
    `/sales?${searchParams.toString()}`,
    "GET",
  );
  return response.data;
}

export function useSales({
  skip,
  createdAt,
  clientName,
  product,
  paid,
  paymentTimeStart,
  paymentTimeEnd,
}: UseSalesParams): UseSalesReturn {
  const queryClient = useQueryClient();
  const errorShownRef = useRef(false);

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "sales",
      skip,
      createdAt,
      clientName,
      product,
      paid,
      paymentTimeStart,
      paymentTimeEnd,
    ],
    queryFn: () =>
      fetchSales({
        skip,
        createdAt,
        clientName,
        product,
        paid,
        paymentTimeStart,
        paymentTimeEnd,
      }),
  });

  useEffect(() => {
    if (error && !errorShownRef.current) {
      errorShownRef.current = true;
      toast.error("Erro ao carregar vendas");
    }
    if (!error) {
      errorShownRef.current = false;
    }
  }, [error]);

  const refetch = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["sales"] });
  }, [queryClient]);

  return {
    sales: data?.sales || [],
    pages: data?.pages || 0,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
