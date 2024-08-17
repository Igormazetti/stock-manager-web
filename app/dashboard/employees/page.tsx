"use client";
import React from "react";
import EmployeesTable from "./components/EmployeesTable";

const employees = [
  { id: "1", name: "John Doe", active: true },
  { id: "2", name: "Jane Smith", active: false },
  { id: "3", name: "Bob Johnson", active: true },
];

export default function EmployeesPage() {
  return (
    <div className="bg-gray-200 w-full h-full p-4 flex flex-col gap-8">
      <div className="flex w-full justify-end">
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
        <EmployeesTable employees={employees} />
      </div>
    </div>
  );
}
