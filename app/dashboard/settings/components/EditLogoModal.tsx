"use client";
import React, { useState, useRef, useMemo } from "react";
import ModalComponent from "@/app/components/Modal/Modal";
import { ModalBody, ModalHeader } from "@nextui-org/react";
import toast from "react-hot-toast";
import { apiFetch } from "@/app/shared/requests";
import Cookies from "js-cookie";
import Image from "next/image";
import { Upload, X } from "phosphor-react";

interface EditLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditLogoModal({ isOpen, onClose }: EditLogoModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cookiesData = Cookies.get("company");
  const company = useMemo(() => {
    if (cookiesData) {
      return JSON.parse(cookiesData);
    }
    return null;
  }, [cookiesData]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem não pode ter mais de 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Por favor, selecione uma imagem");
      return;
    }

    setIsLoading(true);

    try {
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      await apiFetch("/company/update", "PUT", {
        logoUrl: base64String,
      });

      // Update cookie with response
      const cookiesData = Cookies.get("company");
      if (cookiesData) {
        const company = JSON.parse(cookiesData);
        company.logoUrl = base64String;
        Cookies.set("company", JSON.stringify(company));
      }

      toast.success("Logo atualizado com sucesso!");
      handleClose();
    } catch (error: any) {
      console.log(error);
      toast.error("Erro ao atualizar logo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <ModalComponent isOpen={isOpen} onClose={handleClose}>
      <>
        <ModalHeader className="flex flex-col gap-1 text-gray-600 w-full text-center">
          Atualizar Logo
        </ModalHeader>
        <ModalBody className="text-gray-500 pb-4">
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            {/* Current Logo Display */}
            {company?.logoUrl && !preview && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo Atual
                </label>
                <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                  <Image
                    src={company.logoUrl}
                    alt="Current logo"
                    width={128}
                    height={128}
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {/* Preview */}
            {preview && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prévia da Nova Logo
                </label>
                <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center relative">
                  <Image
                    src={preview}
                    alt="Logo preview"
                    width={128}
                    height={128}
                    className="object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* File Input */}
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="logo-input"
              />
              <label
                htmlFor="logo-input"
                className="block w-full px-3 py-2 border border-dashed border-gray-300 rounded text-gray-800 cursor-pointer hover:border-blue-500 transition text-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload size={24} className="text-gray-500" />
                  <span className="text-sm">
                    Clique para selecionar uma imagem
                  </span>
                  <span className="text-xs text-gray-500">
                    PNG, JPG, GIF até 5MB
                  </span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !selectedFile}
              className="mt-4 bg-blue-600 w-full text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Atualizando..." : "Atualizar Logo"}
            </button>
          </form>
        </ModalBody>
      </>
    </ModalComponent>
  );
}
