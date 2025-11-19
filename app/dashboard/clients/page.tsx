"use client";
import { Client } from "@/app/interfaces/client";
import React, { useState } from "react";
import ClientsTable from "./components/ClientsTable";
import ClientDetailsModal from "./components/ClientDetailsModal";
import { Pagination } from "@nextui-org/pagination";
import AddClientModal from "./components/AddClientModal";
import { MagnifyingGlass } from "phosphor-react";
import { useDebounce } from "@/app/hooks/useDebounce";
import { useClients } from "@/app/hooks/useClients";
import { apiFetch } from "@/app/shared/requests";
import toast from "react-hot-toast";

export default function ClientsPage() {
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Client | undefined>();
  const [detailsData, setDetailsData] = useState<Client | undefined>();
  const [pageType, setPageType] = useState<"add" | "edit">();
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce({
    value: searchTerm,
    delay: 1000,
  }) as string;

  const { clients, pages, isLoading, refetch } = useClients({
    skip,
    searchTerm: debouncedSearchTerm,
  });

  const handleOpenEditModal = (clientData: Client) => {
    setEditData(clientData);
    setPageType("edit");
    setIsModalOpen(true);
  };

  const handleOpenDetailsModal = (clientData: Client) => {
    setDetailsData(clientData);
    setIsDetailsModalOpen(true);
  };

  const handleEditFromDetails = () => {
    if (detailsData) {
      setIsDetailsModalOpen(false);
      handleOpenEditModal(detailsData);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await apiFetch(`/clients/delete/${clientId}`, "DELETE");
        toast.success("Cliente excluído com sucesso!");
        await refetch();
      } catch (error) {
        console.log(error);
        toast.error("Erro ao excluir cliente!");
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSkip((page - 1) * 8);
  };

  return (
    <div className="bg-gray-200 w-full h-full p-4 flex flex-col relative">
      <div className="w-full flex justify-between items-center mb-4 gap-2">
        <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
        <div className="flex gap-2">
          <div className="flex relative mr-4">
          <input
            type="text"
            placeholder="Buscar cliente"
            className="border rounded-lg p-2 text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlass className="absolute right-2 top-2" size={26} color="gray" />
        </div>

        <button
          onClick={() => {
            setPageType("add");
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
        >
          Adicionar Cliente
        </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600 text-lg">Carregando clientes...</p>
          </div>
        ) : (
          <ClientsTable
            clients={clients || []}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteClient}
            onRowClick={handleOpenDetailsModal}
          />
        )}

        <div className="w-full flex items-center justify-center bg-transparent">
          <Pagination
            variant="flat"
            showControls
            isDisabled={pages === 1}
            page={currentPage}
            total={pages}
            onChange={(page: number) => handlePageChange(page)}
          />
        </div>
      </div>

      <ClientDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        client={detailsData}
        onEdit={handleEditFromDetails}
      />

      <AddClientModal
        pageType={pageType}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        client={editData}
        refetch={refetch}
      />
    </div>
  );
}
