/* eslint-disable no-unused-vars */
import { Sale } from "@/app/interfaces/sales";
import { formatDate } from "@/app/utils/dateFormatter";

type SaleItemProps = {
  onClick: (id: string) => void;
  sale: Sale;
  index: number;
};

export default function SalesItem({ sale, index, onClick }: SaleItemProps) {
  const changeBg = index % 2 !== 0;
  return (
    <tr
      onClick={() => onClick(sale.id)}
      key={sale.id}
      className={`${changeBg ? "bg-gray-50" : ""} hover:scale-[1.005] hover:cursor-pointer transition ease-in-out delay-[0.2]`}
    >
      <td className="py-2 px-4">{sale.client}</td>
      <td className="py-2 px-4">{sale.totalValue}</td>
      <td className="py-2 px-4">{formatDate(sale.createdAt)}</td>
    </tr>
  );
}
