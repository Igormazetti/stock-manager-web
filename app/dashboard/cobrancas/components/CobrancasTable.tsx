/* eslint-disable no-unused-vars */
import { Sale } from "@/app/interfaces/sales";
import CobrancasItem from "./CobrancasItem";

type CobrancasTableProps = {
  onClick: (sale: Sale) => void;
  sales: Sale[];
};

export default function CobrancasTable({ sales, onClick }: CobrancasTableProps) {
  return (
    <div className="w-full flex-1 overflow-hidden rounded-[8px] flex flex-col">
      <div className="overflow-x-auto overflow-y-auto flex-1">
        <table className="w-full bg-white border-collapse">
          <thead className="sticky top-0">
            <tr className="bg-gray-300">
              <th className="py-3 px-4 border-b border-gray-200 text-start font-semibold text-gray-800 rounded-tl-[8px] min-w-[150px]">
                Cliente
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-start font-semibold text-gray-800 min-w-[180px]">
                Email
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-start font-semibold text-gray-800 min-w-[180px]">
                Endereço
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-start font-semibold text-gray-800 min-w-[100px]">
                Status
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-start font-semibold text-gray-800 min-w-[130px]">
                Valor Total
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-start font-semibold text-gray-800 rounded-tr-[8px] min-w-[150px]">
                Data
              </th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((sale, index) => (
                <CobrancasItem
                  key={sale.id}
                  sale={sale}
                  index={index}
                  onClick={onClick}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  Nenhuma cobrança pendente encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
