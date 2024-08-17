import { Employee } from "@/app/interfaces/employee";
import React from "react";
import EmployeesTableItem from "./EmployeesTableItem";

type EmployeesTableProps = {
  employees: Employee[];
};

export default function EmployeesTable({ employees }: EmployeesTableProps) {
  return (
    <div className="max-w-full overflow-x-auto lg:overflow-hidden lg:max-w-[60%] lg:w-full text-gray-800">
      <table className="w-full bg-white rounded-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 h-12 text-start rounded-tl-[8px] min-w-[200px]">
              Nome
            </th>
            <th className="py-2 px-4 h-12 text-start">Status</th>
            <th className="py-2 px-4 h-12 text-end rounded-tr-[8px] pr-8">Opções</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <EmployeesTableItem key={employee.id} employee={employee} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
