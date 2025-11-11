import React, { useState, useRef, useEffect } from "react";
import { Product } from "@/app/interfaces/product";
import Image from "next/image";
import { formatToBRL } from "@/app/utils/currency";
import { DotsThreeVertical, Info, Pencil, Plus, Minus } from "phosphor-react";

interface ProductCardProps {
  product: Product;
  handleOpenEdit: () => void;
  handleOpenDetails: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  handleOpenEdit,
  handleOpenDetails,
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
    <div className="bg-gray-100 p-4 rounded-md shadow-lg max-h-[280px] relative">
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
                onClick={handleOpenDetails}
              >
                <Info size={20} />
                Detalhes
              </li>
              <li
                className="py-2 px-4 hover:bg-gray-200 cursor-pointer flex gap-2 items-center"
                onClick={handleOpenEdit}
              >
                <Pencil size={20} />
                Editar
              </li>
            </ul>
          </div>
        )}
      </div>

      {product?.imgUrl ? (
        <Image
          src={product.imgUrl || "/placeholder.png"}
          alt={product.title}
          width={16}
          height={16}
          layout="responsive"
          className="w-full object-contain rounded max-h-[150px]"
        />
      ) : (
        <div className="w-full flex h-full max-h-[150px] items-center justify-center">
          <div className="w-[80%] h-full bg-gray-200 flex items-center justify-center">
            <span>Sem Imagem</span>
          </div>
        </div>
      )}

      <h3 className="text-gray-800 text-sm font-bold mt-1 mb-1">{product.title}</h3>
      <p className="text-gray-600 line-clamp-2 text-xs">{product.description}</p>
      <p
        className={`${product.quantity > 0 ? "text-gray-800" : "text-red-600"} font-semibold text-xs mt-1`}
      >
        {product.quantity > 0 ? `Em estoque: ${product.quantity}` : "Fora de estoque"}
      </p>
      <p className="text-gray-800 font-semibold text-xs mt-1">{formatToBRL(product.value)}</p>
      <p className="text-gray-600 text-xs mt-1">Custo: {formatToBRL(product.originalValue)}</p>
    </div>
  );
};

export default ProductCard;
