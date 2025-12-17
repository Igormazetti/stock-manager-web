/* eslint-disable no-unused-vars */
import { Client } from "@/app/interfaces/client";
import ClientItem from "./ClientItem";

type ClientsTableProps = {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
  onRowClick: (client: Client) => void;
};

export default function ClientsTable({
  clients,
  onEdit,
  onDelete,
  onRowClick,
}: ClientsTableProps) {
  return (
    <div className="w-full flex-1 overflow-hidden rounded-[8px] flex flex-col">
      <div className="overflow-x-auto overflow-y-auto flex-1">
        <table className="w-full bg-white border-collapse">
          <thead className="sticky top-0">
            <tr className="bg-gray-300">
              <th className="py-3 px-4 border-b border-gray-200 text-start font-semibold text-gray-800 rounded-tl-[8px] min-w-[150px]">
                Nome
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-start font-semibold text-gray-800 min-w-[200px]">
                Email
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-start font-semibold text-gray-800 min-w-[200px]">
                Endereço
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-center font-semibold text-gray-800 rounded-tr-[8px] min-w-[100px]">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map((client, index) => (
                <ClientItem
                  key={client.id}
                  client={client}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onRowClick={onRowClick}
                />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  Nenhum cliente encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
