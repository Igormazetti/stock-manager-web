/* eslint-disable no-unused-vars */
import { Sale } from "@/app/interfaces/sales";
import { formatDate } from "@/app/utils/dateFormatter";

type CobrancasItemProps = {
  onClick: (sale: Sale) => void;
  sale: Sale;
  index: number;
};

export default function CobrancasItem({ sale, index, onClick }: CobrancasItemProps) {
  const changeBg = index % 2 !== 0;
  const clientName = sale.Client?.name || sale.client;
  const clientEmail = sale.Client?.email || "-";
  const clientAddress = sale.Client?.address || "-";

  return (
    <tr
      className={`${changeBg ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 hover:cursor-pointer transition ease-in-out duration-150`}
      onClick={() => onClick(sale)}
    >
      <td className="py-3 px-4 font-medium text-gray-800">{clientName}</td>
      <td className="py-3 px-4 text-gray-600 text-sm">{clientEmail}</td>
      <td
        className="py-3 px-4 text-gray-600 text-sm max-w-[200px] truncate"
        title={clientAddress}
      >
        {clientAddress}
      </td>
      <td className="py-3 px-4">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
          Pendente
        </span>
      </td>
      <td className="py-3 px-4">
        <span className="text-lg font-bold text-blue-600">
          R$ {sale.totalValue.toFixed(2)}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-600">{formatDate(sale.createdAt)}</td>
    </tr>
  );
}
