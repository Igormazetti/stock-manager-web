"use client";
import React, { useState, useEffect } from "react";
import ModalComponent from "@/app/components/Modal/Modal";
import { ModalBody, ModalHeader } from "@nextui-org/react";
import CustomInput from "@/app/components/Form/Input";
import toast from "react-hot-toast";
import { apiFetch } from "@/app/shared/requests";
import Cookies from "js-cookie";

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CompanyData {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
}

interface UpdateCompanyResponse {
  data: {
    company: CompanyData;
  };
  status: number;
  statusText: string;
}

export default function EditCompanyModal({
  isOpen,
  onClose,
}: EditCompanyModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const cookieData = Cookies.get("company");
      const company = cookieData ? JSON.parse(cookieData) : null;
      if (company) {
        setCompanyName(company.name || "");
        setCompanyEmail(company.email || "");
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    setCompanyName("");
    setCompanyEmail("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim() || !companyEmail.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (!companyEmail.includes("@")) {
      toast.error("Email inválido");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiFetch<UpdateCompanyResponse>("/company/update", "PUT", {
        name: companyName.trim(),
        email: companyEmail.trim(),
      });

      // Update cookie with new company data
      const updatedCompany = response.data.company;
      Cookies.set("company", JSON.stringify(updatedCompany));

      toast.success("Dados da empresa atualizados com sucesso!");
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error("Erro ao atualizar dados da empresa");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalComponent isOpen={isOpen} size="3xl" onClose={handleClose}>
      <>
        <ModalHeader className="flex flex-col gap-1 text-gray-600 w-full text-center">
          Editar Dados da Empresa
        </ModalHeader>
        <ModalBody className="text-gray-500 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="w-full pb-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Empresa *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Digite o nome da empresa"
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email da Empresa *
              </label>
              <input
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                placeholder="Digite o email da empresa"
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 bg-blue-600 w-full text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </form>
        </ModalBody>
      </>
    </ModalComponent>
  );
}
