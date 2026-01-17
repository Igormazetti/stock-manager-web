"use client";
import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import EditCompanyModal from "./components/EditCompanyModal";
import ResetPasswordModal from "./components/ResetPasswordModal";
import EditLogoModal from "./components/EditLogoModal";
import { Gear, User, Lock, Image } from "phosphor-react";
import { apiFetch } from "@/app/shared/requests";
import { applyPhoneMask, applyCNPJMask, applyCEPMask } from "@/app/utils/masks";

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
}

interface GetCompanyResponse {
  data: {
    company: CompanyData;
  };
}

export default function SettingsPage() {
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isEditLogoOpen, setIsEditLogoOpen] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompanyData = async () => {
    try {
      setIsLoading(true);
      const response = await apiFetch<GetCompanyResponse>("/company", "GET");
      setCompanyData(response.data.company);
    } catch (error) {
      console.error("Error fetching company data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  useEffect(() => {
    if (!isEditCompanyOpen) {
      fetchCompanyData();
    }
  }, [isEditCompanyOpen]);

  return (
    <div className="bg-gray-200 w-full h-full p-4 flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Gear size={28} />
          Configurações
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 flex-1">
        <Tabs aria-label="Settings options" color="primary">
          {/* User Data Tab */}
          <Tab
            key="user-data"
            title={
              <div className="flex items-center gap-2">
                <User size={18} />
                Dados da Empresa
              </div>
            }
          >
            <div className="p-4 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Editar Dados da Empresa
              </h2>
              <p className="text-gray-600 mb-4">
                Atualize as informações da sua empresa, como nome, email, CNPJ, telefone,
                endereço e dados de localização.
              </p>

              {isLoading ? (
                <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
                  <p className="text-gray-500 text-center">
                    Carregando dados da empresa...
                  </p>
                </div>
              ) : companyData ? (
                <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nome da Empresa</p>
                      <p className="text-base text-gray-800 mt-1">{companyData.name}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-base text-gray-800 mt-1">{companyData.email}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">CNPJ</p>
                      <p className="text-base text-gray-800 mt-1">
                        {applyCNPJMask(companyData?.cnpj) || ""}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Telefone</p>
                      <p className="text-base text-gray-800 mt-1">
                        {applyPhoneMask(companyData.phone)}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-500">Endereço</p>
                      <p className="text-base text-gray-800 mt-1">
                        {companyData.address}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">CEP</p>
                      <p className="text-base text-gray-800 mt-1">
                        {applyCEPMask(companyData.cep)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Cidade</p>
                      <p className="text-base text-gray-800 mt-1">{companyData.city}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Estado</p>
                      <p className="text-base text-gray-800 mt-1">{companyData.state}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              <button
                onClick={() => setIsEditCompanyOpen(true)}
                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Editar Dados
              </button>
            </div>
          </Tab>

          {/* Logo Tab */}
          <Tab
            key="logo"
            title={
              <div className="flex items-center gap-2">
                <Image size={18} alt="Logo icon" />
                Logo
              </div>
            }
          >
            <div className="p-4 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Alterar Logo</h2>
              <p className="text-gray-600 mb-4">
                Atualize o logo da sua empresa. Formatos aceitos: PNG, JPG, GIF.
              </p>
              <button
                onClick={() => setIsEditLogoOpen(true)}
                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Alterar Logo
              </button>
            </div>
          </Tab>

          {/* Password Tab */}
          <Tab
            key="password"
            title={
              <div className="flex items-center gap-2">
                <Lock size={18} />
                Senha
              </div>
            }
          >
            <div className="p-4 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Redefinir Senha
              </h2>
              <p className="text-gray-600 mb-4">
                Altere sua senha de acesso à plataforma. Use uma senha forte com letras,
                números e caracteres especiais.
              </p>
              <button
                onClick={() => setIsResetPasswordOpen(true)}
                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Alterar Senha
              </button>
            </div>
          </Tab>
        </Tabs>
      </div>

      {/* Modals */}
      <EditCompanyModal
        isOpen={isEditCompanyOpen}
        onClose={() => setIsEditCompanyOpen(false)}
      />

      <EditLogoModal isOpen={isEditLogoOpen} onClose={() => setIsEditLogoOpen(false)} />

      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
      />
    </div>
  );
}
