import React, { useState, useRef, useEffect } from "react";
import { Client } from "@/app/interfaces/client";
import { DotsThreeVertical, Pencil, Trash } from "phosphor-react";

interface ClientCardProps {
  client: Client;
  handleOpenEdit: () => void;
  handleDelete: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({
  client,
  handleOpenEdit,
  handleDelete,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      buttonRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-100 p-4 rounded-md shadow-lg relative">
      <div ref={buttonRef} className="absolute top-2 right-1">
        <DotsThreeVertical
          size={32}
          color="gray"
          className="cursor-pointer transition-opacity duration-200 ease-in-out hover:opacity-60"
          onClick={toggleMenu}
        />

        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute top-full right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10"
          >
            <ul className="list-none p-2 text-gray-600">
              <li
                className="py-2 px-4 hover:bg-gray-200 cursor-pointer flex gap-2 items-center"
                onClick={handleOpenEdit}
              >
                <Pencil size={20} />
                Editar
              </li>
              <li
                className="py-2 px-4 hover:bg-red-100 cursor-pointer flex gap-2 items-center text-red-600"
                onClick={handleDelete}
              >
                <Trash size={20} />
                Excluir
              </li>
            </ul>
          </div>
        )}
      </div>

      <h3 className="text-gray-800 text-lg font-bold mb-2">{client.name}</h3>

      <div className="space-y-1">
        <p className="text-gray-600 text-sm">
          <span className="font-semibold">Email:</span> {client.email}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-semibold">Endereço:</span> {client.address}
        </p>
        {client.observations && (
          <p className="text-gray-600 text-sm">
            <span className="font-semibold">Observações:</span> {client.observations}
          </p>
        )}
      </div>
    </div>
  );
};

export default ClientCard;
