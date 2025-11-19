/* eslint-disable no-unused-vars */
import { Sale } from "@/app/interfaces/sales";
import SalesItem from "./SalesItem";

type SalesTableProps = {
  onClick: (sale: Sale) => void;
  sales: Sale[];
};

export default function SalesTable({ sales, onClick }: SalesTableProps) {
  return (
    <div className="w-full flex-1 overflow-hidden rounded-[8px] flex flex-col">
      <div className="overflow-x-auto overflow-y-auto flex-1">
        <table className="w-full bg-white border-collapse">
          <thead className="sticky top-0">
            <tr className="bg-gray-300">
              <th className="py-3 px-4 border-b border-gray-200 text-start font-semibold text-gray-800 rounded-tl-[8px] min-w-[150px]">
                Cliente
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-start font-semibold text-gray-800 min-w-[250px]">
                Produtos
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-start font-semibold text-gray-800 min-w-[150px]">
                Valor Total
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-start font-semibold text-gray-800 min-w-[150px]">
                Status
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-start font-semibold text-gray-800 rounded-tr-[8px] min-w-[150px]">
                Data
              </th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((sale, index) => (
                <SalesItem key={sale.id} sale={sale} index={index} onClick={onClick} />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  Nenhuma venda encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
