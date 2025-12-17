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
import { Product } from "@/app/interfaces/product";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageType?: "add" | "edit";
  product?: Product;
  refetch: () => Promise<void>;
}

interface FormData {
  title: string;
  code?: string;
  value: number;
  originalValue: number;
  description: string;
  quantity: number;
  imgUrl?: string;
}

const productSchema = yup.object().shape({
  title: yup.string().required("Título é obrigatório"),
  code: yup.string(),
  value: yup
    .number()
    .typeError("Insira um valor válido")
    .required("Valor é obrigatório")
    .min(1, "Insira um valor válido"),
  originalValue: yup
    .number()
    .typeError("Insira um valor válido")
    .required("Valor de custo é obrigatório")
    .min(1, "Insira um valor válido"),
  description: yup.string().required("Descrição é obrigatório"),
  quantity: yup
    .number()
    .typeError("Insira um valor válido")
    .required("Quantidade é obrigatório")
    .min(0, "Insira um valor válido"),
  imgUrl: yup.string(),
});

export default function AddProductModal({
  isOpen,
  onClose,
  pageType,
  product,
  refetch,
}: AddProductModalProps) {
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
    resolver: yupResolver(productSchema),
    defaultValues: {
      quantity: 0,
      value: 0,
      originalValue: 0,
    },
  });

  const handleClose = () => {
    onClose();
    reset();
  };

  const onSubmitHandler: SubmitHandler<FormData> = async (data) => {
    if (pageType === "edit" && product) {
      try {
        await apiFetch(`/products/update/${product.id}`, "PATCH", {
          ...data,
        });
        toast.success("Produto atualizado com sucesso!");

        await refetch();

        handleClose();
      } catch {
        toast.error("Erro ao editar produto!");
      }

      return;
    }

    try {
      await apiFetch(`/products/create`, "POST", {
        ...data,
        companyId: company.id,
      });
      toast.success("Produto adicionado com sucesso!");

      await refetch();

      handleClose();
    } catch (error) {
      console.log(error);
      toast.error("Erro ao salvar produto!");
    }
  };

  useEffect(() => {
    if (isOpen && pageType === "edit" && product) {
      setValue("title", product.title);
      setValue("code", product.code || "");
      setValue("description", product.description);
      setValue("value", product.value);
      setValue("originalValue", product.originalValue);
      setValue("quantity", product.quantity);
      setValue("imgUrl", product.imgUrl || "");
    } else {
      reset();
    }
  }, [isOpen, pageType, product, setValue, reset]);

  return (
    <ModalComponent isOpen={isOpen} onClose={handleClose}>
      <>
        <ModalHeader className="flex flex-col gap-1 text-gray-600 w-full text-center">
          {pageType === "edit" ? "Editar Produto" : "Adicionar Produto"}
        </ModalHeader>
        <ModalBody className="text-gray-500">
          <form onSubmit={handleSubmit(onSubmitHandler)} className="w-full max-w-sm pb-4">
            <CustomInput
              label="Título *"
              id="title"
              registration={register("title")}
              error={errors.title?.message}
            />

            <CustomInput
              label="Código"
              id="code"
              registration={register("code")}
              error={errors.code?.message}
            />

            <CustomInput
              label="Valor (R$) *"
              id="value"
              type="number"
              step="0.01"
              registration={register("value")}
              error={errors.value?.message}
            />

            <CustomInput
              label="Valor de custo *"
              id="originalValue"
              type="number"
              step="0.01"
              registration={register("originalValue")}
              error={errors.originalValue?.message}
            />

            <CustomInput
              label="Descrição *"
              id="description"
              registration={register("description")}
              error={errors.description?.message}
            />

            <CustomInput
              label="Quantidade *"
              id="quantity"
              type="number"
              registration={register("quantity")}
              error={errors.quantity?.message}
            />

            <CustomInput
              label="Imagem"
              id="image"
              registration={register("imgUrl")}
              error={errors.imgUrl?.message}
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
