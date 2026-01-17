import { Employee } from "@/app/interfaces/employee";
import { apiFetch } from "@/app/shared/requests";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";

interface UseEmployeesParams {
  employeeStatus: boolean | null;
}

interface UseEmployeesReturn {
  employees: Employee[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

async function fetchEmployees(employeeStatus: boolean | null) {
  const response = await apiFetch<any>(
    `/employee${employeeStatus === null ? "" : `?active=${employeeStatus}`}`,
    "GET",
  );
  return response.data;
}

export function useEmployees({ employeeStatus }: UseEmployeesParams): UseEmployeesReturn {
  const queryClient = useQueryClient();
  const errorShownRef = useRef(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["employees", employeeStatus],
    queryFn: () => fetchEmployees(employeeStatus),
  });

  useEffect(() => {
    if (error && !errorShownRef.current) {
      errorShownRef.current = true;
      toast.error("Erro ao carregar funcionários");
    }
    if (!error) {
      errorShownRef.current = false;
    }
  }, [error]);

  const refetch = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["employees"] });
  }, [queryClient]);

  return {
    employees: data?.employees || [],
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
