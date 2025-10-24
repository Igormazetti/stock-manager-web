import React, { useState } from "react";
import {
  CaretLeft,
  CaretRight,
  Money,
  Package,
  SignOut,
} from "phosphor-react";
import { usePathname, useRouter } from "next/navigation";
import MenuButton from "../MenuButton/MenuButton";

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
        className={`fixed top-0 left-0 h-full bg-gray-100 transition-all duration-300 ${isOpen ? "w-[260px]" : "w-[80px]"} text-black`}
      >
        <button
          onClick={toggleMenu}
          className="absolute top-4 right-0 text-white rounded-full z-50"
        >
          {isOpen ? (
            <CaretLeft color="black" size={24} />
          ) : (
            <CaretRight color="black" size={24} />
          )}
        </button>
        <div
          className={`flex flex-col items-center h-full transition-opacity duration-300 gap-4 `}
        >
          <h1 className={`text-2xl mt-4 mb-4 ${isOpen ? "opacity-100" : "opacity-0"}`}>
            Menu
          </h1>

          <MenuButton path="products" isOpen={isOpen} />          

          {/* Vendas */}
           
          <MenuButton path="sales" isOpen={isOpen} />        

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
          <div className="flex w-full justify-end pr-5">
            <button>
              <SignOut size={32} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
