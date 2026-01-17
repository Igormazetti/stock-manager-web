"use client";
import React, { useState, useEffect } from "react";
import ModalComponent from "@/app/components/Modal/Modal";
import { ModalBody, ModalHeader } from "@nextui-org/react";
import toast from "react-hot-toast";
import { apiFetch } from "@/app/shared/requests";
import {
  applyPhoneMask,
  applyCNPJMask,
  applyCEPMask,
  formatForBackend,
} from "@/app/utils/masks";

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CompanyData {
  id: string;
  name: string;
  email: string;
  cnpj?: string | null;
  address?: string | null;
  phone?: string | null;
  cep?: string | null;
  city?: string | null;
  state?: string | null;
  [key: string]: any;
}

interface UpdateCompanyResponse {
  data: {
    company: CompanyData;
  };
  status: number;
  statusText: string;
}

interface GetCompanyResponse {
  data: {
    company: CompanyData;
  };
}

export default function EditCompanyModal({ isOpen, onClose }: EditCompanyModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (isOpen) {
        try {
          const response = await apiFetch<GetCompanyResponse>("/company", "GET");
          const company = response.data.company;
          setCompanyName(company.name || "");
          setCompanyEmail(company.email || "");
          setCnpj(company.cnpj ? applyCNPJMask(company.cnpj) : "");
          setAddress(company.address || "");
          setPhone(company.phone ? applyPhoneMask(company.phone) : "");
          setCep(company.cep ? applyCEPMask(company.cep) : "");
          setCity(company.city || "");
          setState(company.state || "");
        } catch (error) {
          console.error("Error fetching company data:", error);
          toast.error("Erro ao carregar dados da empresa");
        }
      }
    };

    fetchCompanyData();
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    setCompanyName("");
    setCompanyEmail("");
    setCnpj("");
    setAddress("");
    setPhone("");
    setCep("");
    setCity("");
    setState("");
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
      await apiFetch<UpdateCompanyResponse>("/company/update", "PUT", {
        name: companyName.trim(),
        email: companyEmail.trim(),
        cnpj: cnpj ? formatForBackend(cnpj) : null,
        address: address.trim() || null,
        phone: phone ? formatForBackend(phone) : null,
        cep: cep ? formatForBackend(cep) : null,
        city: city.trim() || null,
        state: state.trim() || null,
      });

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

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(applyCNPJMask(e.target.value))}
                placeholder="00.000.000/0000-00"
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(applyPhoneMask(e.target.value))}
                placeholder="(00) 00000-0000"
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Digite o endereço completo"
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP
                </label>
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(applyCEPMask(e.target.value))}
                  placeholder="00000-000"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Digite a cidade"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o estado</option>
                <option value="AC">AC</option>
                <option value="AL">AL</option>
                <option value="AP">AP</option>
                <option value="AM">AM</option>
                <option value="BA">BA</option>
                <option value="CE">CE</option>
                <option value="DF">DF</option>
                <option value="ES">ES</option>
                <option value="GO">GO</option>
                <option value="MA">MA</option>
                <option value="MT">MT</option>
                <option value="MS">MS</option>
                <option value="MG">MG</option>
                <option value="PA">PA</option>
                <option value="PB">PB</option>
                <option value="PR">PR</option>
                <option value="PE">PE</option>
                <option value="PI">PI</option>
                <option value="RJ">RJ</option>
                <option value="RN">RN</option>
                <option value="RS">RS</option>
                <option value="RO">RO</option>
                <option value="RR">RR</option>
                <option value="SC">SC</option>
                <option value="SP">SP</option>
                <option value="SE">SE</option>
                <option value="TO">TO</option>
              </select>
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
