import CustomInput from "@/app/components/Form/Input";
import ModalComponent from "@/app/components/Modal/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import { ModalBody, ModalHeader } from "@nextui-org/react";
import React, { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import Cookies from "js-cookie";
import { apiFetch } from "@/app/shared/requests";
import toast from "react-hot-toast";
import { Sale } from "@/app/interfaces/sales";
import Select from "react-select";

interface AddSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  client: string;
  products: { id: string; quantity: number }[];
}

const saleSchema = yup.object().shape({
  client: yup.string().required("Cliente é obrigatório"),
  products: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required(),
        quantity: yup.number().min(1, "Quantidade deve ser maior que 0").required(),
      }),
    )
    .min(1, "Selecione pelo menos um produto"),
});

export default function AddSaleModal({ isOpen, onClose }: AddSaleModalProps) {
  const cookiesData = Cookies.get("company");
  const [productsList, setProductsList] = useState<
    Array<{ value: string; label: string }>
  >([]);

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
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(saleSchema),
    defaultValues: {
      client: "",
      products: [],
    },
  });

  const handleClose = () => {
    onClose();
    reset();
  };

  const onSubmitHandler: SubmitHandler<FormData> = async (data) => {
    try {
      await apiFetch(`/sales`, "POST", data);
      toast.success("Venda registrada com sucesso!");
      handleClose();
    } catch (error) {
      toast.error("Erro ao registrar venda!");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiFetch("/products", "GET");
        const formattedProducts = response.data.map((product: any) => ({
          value: product.id,
          label: product.name,
        }));
        setProductsList(formattedProducts);
      } catch (error) {
        toast.error("Erro ao carregar produtos");
      }
    };

    fetchProducts();
  }, []);

  return (
    <ModalComponent isOpen={isOpen} onClose={handleClose}>
      <>
        <ModalHeader className="flex flex-col gap-1 text-gray-600 w-full text-center">
          Adicionar Venda
        </ModalHeader>
        <ModalBody className="text-gray-500">
          <form onSubmit={handleSubmit(onSubmitHandler)} className="w-full max-w-sm pb-4">
            <CustomInput
              label="Cliente *"
              id="client"
              registration={register("client")}
              error={errors.client?.message}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Produtos *
              </label>
              <Controller
                name="products"
                control={control}
                render={({ field }) => (
                  <Select
                    isMulti
                    options={productsList}
                    onChange={(selectedOptions) => {
                      const formattedProducts = selectedOptions.map((option) => ({
                        id: option.value,
                        quantity: 1, // Default quantity
                      }));
                      field.onChange(formattedProducts);
                    }}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                )}
              />
              {errors.products && (
                <p className="text-red-500 text-xs mt-1">{errors.products.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="mt-2 bg-blue-600 w-full text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
            >
              Salvar
            </button>
          </form>
        </ModalBody>
      </>
    </ModalComponent>
  );
}
