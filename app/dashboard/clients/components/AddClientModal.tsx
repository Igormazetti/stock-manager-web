import CustomInput from "@/app/components/Form/Input";
import ModalComponent from "@/app/components/Modal/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import { ModalBody, ModalHeader } from "@nextui-org/react";
import React, { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import Cookies from "js-cookie";
import { apiFetch } from "@/app/shared/requests";
import toast from "react-hot-toast";
import { Client } from "@/app/interfaces/client";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageType?: "add" | "edit";
  client?: Client;
  refetch: () => Promise<void>;
}

interface FormData {
  name: string;
  email: string;
  address: string;
  observations?: string;
}

const clientSchema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("Insira um email válido").required("Email é obrigatório"),
  address: yup.string().required("Endereço é obrigatório"),
  observations: yup.string().optional(),
});

export default function AddClientModal({
  isOpen,
  onClose,
  pageType,
  client,
  refetch,
}: AddClientModalProps) {
  const cookiesData = Cookies.get("company");

  const company = useMemo(() => {
    if (cookiesData) {
      return JSON.parse(cookiesData);
    }

    return null;
  }, [cookiesData]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(clientSchema),
  });

  const handleClose = () => {
    onClose();
    reset();
  };

  const onSubmitHandler: SubmitHandler<FormData> = async (data) => {
    if (pageType === "edit" && client) {
      try {
        await apiFetch(`/clients/update/${client.id}`, "PATCH", {
          ...data,
        });
        toast.success("Cliente atualizado com sucesso!");

        await refetch();

        handleClose();
      } catch {
        toast.error("Erro ao editar cliente!");
      }

      return;
    }

    try {
      await apiFetch(`/clients/create`, "POST", {
        ...data,
        companyId: company.id,
      });
      toast.success("Cliente adicionado com sucesso!");

      await refetch();

      handleClose();
    } catch (error) {
      console.log(error);
      toast.error("Erro ao salvar cliente!");
    }
  };

  useEffect(() => {
    if (isOpen && pageType === "edit" && client) {
      setValue("name", client.name);
      setValue("email", client.email);
      setValue("address", client.address);
      setValue("observations", client.observations || "");
    } else {
      reset();
    }
  }, [isOpen, pageType, client, setValue, reset]);

  return (
    <ModalComponent isOpen={isOpen} onClose={handleClose}>
      <>
        <ModalHeader className="flex flex-col gap-1 text-gray-600 w-full text-center">
          {pageType === "edit" ? "Editar Cliente" : "Adicionar Cliente"}
        </ModalHeader>
        <ModalBody className="text-gray-500">
          <form onSubmit={handleSubmit(onSubmitHandler)} className="w-full pb-4">
            <CustomInput
              label="Nome *"
              id="name"
              registration={register("name")}
              error={errors.name?.message}
            />

            <CustomInput
              label="Email *"
              id="email"
              type="email"
              registration={register("email")}
              error={errors.email?.message}
            />

            <CustomInput
              label="Endereço *"
              id="address"
              registration={register("address")}
              error={errors.address?.message}
            />

            <CustomInput
              label="Observações"
              id="observations"
              registration={register("observations")}
              error={errors.observations?.message}
            />

            <button
              type="submit"
              className="mt-2 bg-blue-600 w-full text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
            >
              {pageType === "edit" ? "Editar" : "Salvar"}
            </button>
          </form>
        </ModalBody>
      </>
    </ModalComponent>
  );
}
