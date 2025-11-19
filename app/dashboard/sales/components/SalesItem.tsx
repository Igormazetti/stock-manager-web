/* eslint-disable no-unused-vars */
import { Sale } from "@/app/interfaces/sales";
import { formatDate } from "@/app/utils/dateFormatter";

type SaleItemProps = {
  onClick: (sale: Sale) => void;
  sale: Sale;
  index: number;
};

export default function SalesItem({ sale, index, onClick }: SaleItemProps) {
  const changeBg = index % 2 !== 0;
  const clientName = sale.Client?.name || sale.client;
  const productNames = sale.Products?.map((p) => p.Product.title).join(", ") || "Sem produtos";
  const isPaid = (sale as any).paid || false;

  return (
    <tr
      className={`${changeBg ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 hover:cursor-pointer transition ease-in-out duration-150`}
      onClick={() => onClick(sale)}
    >
      <td className="py-3 px-4 font-medium text-gray-800">{clientName}</td>
      <td className="py-3 px-4 text-gray-600">
        <div className="max-h-[80px] overflow-y-auto text-sm">
          {productNames}
        </div>
      </td>
      <td className="py-3 px-4 text-gray-600">R$ {sale.totalValue.toFixed(2)}</td>
      <td className="py-3 px-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            isPaid
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {isPaid ? "✓ Pago" : "Pendente"}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-600">{formatDate(sale.createdAt)}</td>
    </tr>
  );
}
