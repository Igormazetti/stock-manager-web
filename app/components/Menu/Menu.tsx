import React, { useState } from "react";
import { Bag, CaretLeft, CaretRight, Money, Package, SignOut, Users } from "phosphor-react";

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative h-screen">
      <div className={`fixed top-0 left-0 h-full bg-gray-100 transition-all duration-300 ${isOpen ? "w-[260px]" : "w-[80px]"} text-black`}>
        <button onClick={toggleMenu} className="absolute top-4 right-0 text-white rounded-full z-50">
          {isOpen ? <CaretLeft color="black" size={24} /> : <CaretRight color="black" size={24} />}
        </button>
        <div className={`flex flex-col items-center h-full transition-opacity duration-300 ${isOpen ? "gap-4" : "gap-8"} `}>
          <h1 className={`text-2xl mt-4 mb-4 ${isOpen ? "opacity-100" : "opacity-0"}`}>Menu</h1>
          {isOpen ? (
            <button className="py-2 w-11/12 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors">Produtos</button>
          ) : (
            <button>
              <Package size={32} />
            </button>
          )}

          {isOpen ? (
            <button className="py-2 w-11/12 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors">Funcionários</button>
          ) : (
            <button>
              <Users size={32} />
            </button>
          )}

          {isOpen ? (
            <button className="py-2 w-11/12 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors">Vendas</button>
          ) : (
            <button>
              <Money size={32} />
            </button>
          )}

          {isOpen ? (
            <button className="py-2 w-11/12 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors">Compras</button>
          ) : (
            <button>
              <Bag size={32} />
            </button>
          )}
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
