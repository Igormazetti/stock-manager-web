import { Client, ClientRequestData } from "@/app/interfaces/client";
import { apiFetch } from "@/app/shared/requests";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";

interface UseClientsParams {
  skip: number;
  searchTerm: string;
}

interface UseClientsReturn {
  clients: Client[];
  pages: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

async function fetchClients(skip: number, searchTerm: string) {
  const response = await apiFetch<ClientRequestData>(
    `/clients?skip=${skip}&name=${searchTerm}`,
    "GET",
  );
  return response.data;
}

export function useClients({ skip, searchTerm }: UseClientsParams): UseClientsReturn {
  const queryClient = useQueryClient();
  const errorShownRef = useRef(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["clients", skip, searchTerm],
    queryFn: () => fetchClients(skip, searchTerm),
  });

  useEffect(() => {
    if (error && !errorShownRef.current) {
      errorShownRef.current = true;
      toast.error("Erro ao carregar clientes");
    }
    if (!error) {
      errorShownRef.current = false;
    }
  }, [error]);

  const refetch = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["clients"] });
  }, [queryClient]);

  return {
    clients: data?.clients || [],
    pages: data?.pages || 0,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
