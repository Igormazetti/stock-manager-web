import { Employee } from "@/app/interfaces/employee";
import { apiFetch } from "@/app/shared/requests";
import { useEffect, useState } from "react";
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

export function useEmployees({ employeeStatus }: UseEmployeesParams): UseEmployeesReturn {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFetch<any>(
        `/employee${employeeStatus === null ? "" : `?active=${employeeStatus}`}`,
        "GET",
      );
      setEmployees(response.data.employees || []);
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.log(error);
      toast.error("Erro ao carregar funcionários");
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeStatus]);

  return {
    employees,
    isLoading,
    error,
    refetch: fetchEmployees,
  };
}
