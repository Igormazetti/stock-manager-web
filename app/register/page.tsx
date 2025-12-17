"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Spinner } from "@nextui-org/spinner";
import Link from "next/link";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const registerSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Nome deve ter ao menos 3 caracteres")
    .required("Nome da empresa é obrigatório"),
  email: yup.string().email("Insira um email válido").required("Email é obrigatório"),
  password: yup
    .string()
    .min(6, "Senha deve ter ao menos 6 caracteres")
    .required("Senha é obrigatória"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas devem ser iguais")
    .required("Confirmação de senha é obrigatória"),
});

export default function RegisterPage() {
  const size = useWindowSize();
  const [loading, setLoading] = useState(false);

  const isMobile = useMemo(() => {
    if (size && size.width) {
      return size.width < 460;
    }
    return false;
  }, [size]);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmitHandler: SubmitHandler<RegisterFormData> = async (data) => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:6060/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Empresa registrada com sucesso! Faça login para continuar.");
        router.push("/");
      } else {
        toast.error(result.message || "Erro ao registrar empresa");
      }
    } catch (error) {
      console.error("Erro ao registrar empresa:", error);
      toast.error("Erro ao registrar empresa. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex justify-center items-center">
      <div
        className={`flex flex-col justify-center items-center text-gray-800 rounded-2xl shadow-md ${
          isMobile ? "w-[360px] p-4" : "w-[500px]"
        } min-h-[500px] py-8`}
      >
        <p className="font-bold text-xl mb-8">Registrar Nova Empresa</p>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="w-full max-w-sm">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nome da Empresa
            </label>
            <input
              id="name"
              type="text"
              className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 rounded-md"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 rounded-md"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 rounded-md"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 rounded-md"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {loading ? (
            <div className="flex items-center justify-center w-full">
              <Spinner size="sm" />
            </div>
          ) : (
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 w-full"
            >
              Registrar
            </button>
          )}
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link href="/" className="text-blue-500 hover:text-blue-600 font-medium">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
