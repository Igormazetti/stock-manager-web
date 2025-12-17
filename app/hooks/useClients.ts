import { Client, ClientRequestData } from "@/app/interfaces/client";
import { apiFetch } from "@/app/shared/requests";
import { useEffect, useState } from "react";
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

export function useClients({ skip, searchTerm }: UseClientsParams): UseClientsReturn {
  const [clients, setClients] = useState<Client[]>([]);
  const [pages, setPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFetch<ClientRequestData>(
        `/clients?skip=${skip}&name=${searchTerm}`,
        "GET",
      );
      setPages(response.data.pages);
      setClients(response.data.clients || []);
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.log(error);
      toast.error("Erro ao carregar clientes");
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, searchTerm]);

  return {
    clients,
    pages,
    isLoading,
    error,
    refetch: fetchClients,
  };
}
