/* eslint-disable no-unused-vars */
import { Sale } from "@/app/interfaces/sales";
import SalesItem from "./SalesItem";

type SalesTableProps = {
  onClick: (id: string) => void;
  sales: Sale[];
};

export default function SalesTable({ sales, onClick }: SalesTableProps) {
  return (
    <div className="max-w-[380px] max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden md:max-w-full lg:max-w-[60%] lg:w-full text-black rounded-[8px]">
      <table className="w-full bg-white">
        <thead>
          <tr className="bg-gray-300">
            <th className="py-2 px-4 border-b border-gray-200 text-start rounded-tl-[8px] min-w-[200px] lg:min-w-[280px] ">
              Cliente
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-start">Valor Total</th>
            <th className="py-2 px-4 border-b border-gray-200 text-start rounded-tr-[8px] min-w-[300px]">
              Data
            </th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale, index) => (
            <SalesItem key={sale.id} sale={sale} index={index} onClick={onClick} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
