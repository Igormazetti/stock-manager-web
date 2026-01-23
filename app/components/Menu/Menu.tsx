import React, { useState } from "react";
import { CaretLeft, CaretRight, SignOut, Gear } from "phosphor-react";
import { usePathname, useRouter } from "next/navigation";
import MenuButton from "../MenuButton/MenuButton";
import Cookies from "js-cookie";
import { colors } from "@/app/styles/colors";

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative h-screen z-40">
      <div
        className={`fixed top-0 left-0 h-full transition-all duration-300 ${isOpen ? "w-[260px]" : "w-[80px]"}`}
        style={{
          backgroundColor: colors.sand,
          color: colors.graphite,
        }}
      >
        <button
          onClick={toggleMenu}
          className="absolute top-4 right-0 rounded-full z-50"
          style={{ color: colors.petrolBlue }}
        >
          {isOpen ? <CaretLeft size={24} /> : <CaretRight size={24} />}
        </button>
        <div
          className={`flex flex-col items-center h-full transition-opacity duration-300 gap-4 `}
        >
          <h1
            className={`text-2xl mt-4 mb-4 font-bold transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
            style={{ color: colors.petrolBlue }}
          >
            Menu
          </h1>

          <MenuButton path="products" isOpen={isOpen} />

          {/* Vendas */}

          <MenuButton path="sales" isOpen={isOpen} />

          {/* Cobranças */}
          <MenuButton path="cobrancas" isOpen={isOpen} />

          {/* Clientes */}
          <MenuButton path="clients" isOpen={isOpen} />

          {/* {isOpen ? (
            <button
              onClick={() => {
                if (!pathname.includes("employees")) {
                  router.push("/dashboard/employees");
                }
              }}
              className={`py-2 w-11/12 text-white rounded-md hover:bg-gray-500 transition-colors ${
                pathname.includes("employees") ? "bg-blue-600 text-white" : "bg-gray-400"
              }`}
            >
              Funcionários
            </button>
          ) : (
            <button
              onClick={() => {
                if (!pathname.includes("employees")) {
                  router.push("/dashboard/employees");
                }
              }}
              className={
                pathname.includes("employees")
                  ? "bg-blue-600 text-white rounded-md w-[90%] flex justify-center"
                  : ""
              }
            >
              <Users size={32} />
            </button>
          )} */}

          {/*  */}

          {/* {isOpen ? (
            <button
              className={`py-2 w-11/12 text-white rounded-md hover:bg-gray-500 transition-colors ${
                pathname.includes("purchases") ? "bg-blue-600 text-white" : "bg-gray-400"
              }`}
            >
              Compras
            </button>
          ) : (
            <button
              className={
                pathname.includes("purchases")
                  ? "bg-blue-600 text-white rounded-md w-[90%] flex justify-center"
                  : ""
              }
            >
              <Bag size={32} />
            </button>
          )} */}
        </div>
        <div className="absolute bottom-4 w-full">
          <div className="flex flex-col items-end gap-2 pr-5">
            {/* Settings Button */}
            {isOpen ? (
              <button
                onClick={() => {
                  if (!pathname.includes("settings")) {
                    router.push("/dashboard/settings");
                  }
                }}
                className="py-2 px-4 rounded-md transition-colors flex items-center gap-2 w-11/12"
                style={{
                  backgroundColor: pathname.includes("settings")
                    ? colors.petrolBlue
                    : "transparent",
                  color: pathname.includes("settings") ? colors.white : colors.petrolBlue,
                }}
                onMouseEnter={(e) => {
                  if (!pathname.includes("settings")) {
                    e.currentTarget.style.backgroundColor = colors.petrolBlueMist;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!pathname.includes("settings")) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <Gear size={20} />
                Configurações
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!pathname.includes("settings")) {
                    router.push("/dashboard/settings");
                  }
                }}
                className="p-2 rounded-md transition-colors"
                style={{
                  backgroundColor: pathname.includes("settings")
                    ? colors.petrolBlue
                    : "transparent",
                  color: pathname.includes("settings") ? colors.white : colors.petrolBlue,
                }}
                onMouseEnter={(e) => {
                  if (!pathname.includes("settings")) {
                    e.currentTarget.style.backgroundColor = colors.petrolBlueMist;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!pathname.includes("settings")) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <Gear size={24} />
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={async () => {
                Cookies.remove("token");
                Cookies.remove("company");
                // Clear any other auth-related cookies
                Object.keys(Cookies.get()).forEach((cookieName) => {
                  if (cookieName.includes("auth") || cookieName.includes("session")) {
                    Cookies.remove(cookieName);
                  }
                });
                router.push("/");
              }}
              className="p-2 rounded-md transition-colors"
              style={{
                color: colors.errorPrimary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.errorLight;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <SignOut size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
