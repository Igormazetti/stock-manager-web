import { Employee } from "@/app/interfaces/employee";
import { Pencil, Trash } from "phosphor-react";

type EmployeeItemProps = {
  employee: Employee;
  index: number;
};

export default function EmployeesTableItem({ employee, index }: EmployeeItemProps) {
  const changeBg = index % 2 !== 0;
  return (
    <tr className={`${changeBg ? "bg-gray-50" : ""}`}>
      <td className="py-2 px-4">{employee.name}</td>
      <td className="py-2 px-4">{employee.active ? "Ativo" : "Bloqueado"}</td>
      <td className="py-2 px-4 flex justify-end gap-2">
        <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Pencil size={20} />
        </button>

        <button className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
          <Trash size={20} />
        </button>
      </td>
    </tr>
  );
}
