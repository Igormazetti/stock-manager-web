"use client";
import React, { useState } from "react";
import EmployeesTable from "./components/EmployeesTable";
import { useQuery } from "react-query";
import { Employee } from "@/app/interfaces/employee";
import { apiFetch } from "@/app/shared/requests";
import toast from "react-hot-toast";
import ModalComponent from "@/app/components/Modal/Modal";

export default function EmployeesPage() {
  const [employeeStatus, setEmployeeStatus] = useState<boolean | null>(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const { data: employees } = useQuery<Employee[]>(
    ["solicitations", employeeStatus],
    () => getEmployees(),
    {
      staleTime: 1000 * 60 * 3,
      refetchInterval: 1000 * 60 * 3,
    },
  );

  const getEmployees = async () => {
    try {
      const response = await apiFetch<any>(
        `/employee${employeeStatus === null ? "" : `?active=${employeeStatus}`}`,
        "GET",
      );
      return response.data.employees || [];
    } catch (error) {
      console.log(error);
      toast.error("Erro ao carregar funcionários");
    }
  };

  const handleFilterChange = (value: string) => {
    if (value === "all") {
      setEmployeeStatus(null);
    } else if (value === "active") {
      setEmployeeStatus(true);
    } else if (value === "blocked") {
      setEmployeeStatus(false);
    }
    setIsFilterModalOpen(false);
  };

  return (
    <div className="bg-gray-200 w-full h-full p-4 flex flex-col gap-8">
      <div className="flex w-full justify-end gap-4">
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
        >
          Filtros
        </button>
        <button
          onClick={() => {
            // setPageType("add");
            // setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
        >
          Adicionar Funcionário
        </button>
      </div>

      <div className="flex w-full justify-center">
        <EmployeesTable employees={employees || []} />
      </div>

      <ModalComponent
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      >
        <div className="p-4 text-black">
          <h2 className="text-lg font-semibold mb-4">Filtrar Funcionários</h2>
          <select
            onChange={(e) => handleFilterChange(e.target.value)}
            value={
              employeeStatus === null ? "all" : employeeStatus ? "active" : "blocked"
            }
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="blocked">Bloqueados</option>
          </select>
        </div>
      </ModalComponent>
    </div>
  );
}
