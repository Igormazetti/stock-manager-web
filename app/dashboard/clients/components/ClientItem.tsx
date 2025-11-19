/* eslint-disable no-unused-vars */
import { Client } from "@/app/interfaces/client";
import { Pencil, Trash } from "phosphor-react";

type ClientItemProps = {
  client: Client;
  index: number;
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
  onRowClick: (client: Client) => void;
};

export default function ClientItem({ client, index, onEdit, onDelete, onRowClick }: ClientItemProps) {
  const changeBg = index % 2 !== 0;

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't open details if clicking on action buttons
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    onRowClick(client);
  };

  return (
    <tr
      className={`${changeBg ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 hover:cursor-pointer transition ease-in-out duration-150`}
      onClick={handleRowClick}
    >
      <td className="py-3 px-4 font-medium text-gray-800">{client.name}</td>
      <td className="py-3 px-4 text-gray-600">{client.email}</td>
      <td className="py-3 px-4 text-gray-600">{client.address}</td>
      <td className="py-3 px-4">
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => onEdit(client)}
            className="p-2 hover:bg-blue-100 rounded transition-colors"
            title="Editar cliente"
          >
            <Pencil size={32} color="blue" />
          </button>
          <button
            onClick={() => onDelete(client.id)}
            className="p-2 hover:bg-red-100 rounded transition-colors"
            title="Excluir cliente"
          >
            <Trash size={32} color="red" />
          </button>
        </div>
      </td>
    </tr>
  );
}
