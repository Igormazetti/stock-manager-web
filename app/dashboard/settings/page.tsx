"use client";
import React, { useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import EditCompanyModal from "./components/EditCompanyModal";
import ResetPasswordModal from "./components/ResetPasswordModal";
import EditLogoModal from "./components/EditLogoModal";
import { Gear, User, Lock, Image } from "phosphor-react";

export default function SettingsPage() {
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isEditLogoOpen, setIsEditLogoOpen] = useState(false);

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
                Atualize as informações básicas da sua empresa, como nome e
                email.
              </p>
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
                <Image size={18} />
                Logo
              </div>
            }
          >
            <div className="p-4 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Alterar Logo
              </h2>
              <p className="text-gray-600 mb-4">
                Atualize o logo da sua empresa. Formatos aceitos: PNG, JPG,
                GIF.
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
                Altere sua senha de acesso à plataforma. Use uma senha forte
                com letras, números e caracteres especiais.
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

      <EditLogoModal
        isOpen={isEditLogoOpen}
        onClose={() => setIsEditLogoOpen(false)}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
      />
    </div>
  );
}
