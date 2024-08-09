"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface FormData {
  email: string;
  password: string;
}

const loginSchema = yup.object().shape({
  email: yup.string().email("Insira um email válido").required("Email é obrigatório"),
  password: yup.string().min(6, "Senha deve ter ao menos 6 caracteres").required("Insira uma senha"),
});

export default function Login() {
  const size = useWindowSize();
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
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmitHandler: SubmitHandler<FormData> = async (data) => {
    const login = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (login?.error) {
      toast.error("Login ou senha inválidos");
      return;
    }

    router.replace("/dashboard/products");
    reset();
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex justify-center items-center">
      <div
        className={`flex flex-col justify-center items-center text-gray-800 rounded-2xl shadow-md ${
          isMobile ? "w-[360px] p-4" : "w-[500px]"
        } h-[400px]`}
      >
        <p className="font-bold text-xl mb-12">Stock Manager Login</p>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="w-full max-w-sm">
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
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 rounded-md"
              {...register("password")}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
