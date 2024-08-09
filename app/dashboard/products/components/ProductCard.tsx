import React, { useState, useRef, useEffect } from "react";
import { Product } from "@/app/interfaces/product";
import Image from "next/image";
import { formatToBRL } from "@/app/utils/currency";
import { DotsThreeVertical, Info, Pencil } from "phosphor-react";

interface ProductCardProps {
  product: Product;
  handleOpenEdit: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, handleOpenEdit }) => {
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
    <div className="bg-gray-100 p-4 rounded shadow-lg max-h-[380px] relative">
      <div ref={buttonRef} className="absolute top-2 right-1">
        <DotsThreeVertical
          size={32}
          color="gray"
          className="cursor-pointer transition-opacity duration-200 ease-in-out hover:opacity-60"
          onClick={toggleMenu}
        />
        {isMenuOpen && (
          <div ref={menuRef} className="absolute top-full right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
            <ul className="list-none p-2 text-gray-600">
              <li
                className="py-2 px-4 hover:bg-gray-200 cursor-pointer flex gap-2 items-center"
                onClick={() => {
                  console.log("Detalhes clicked");
                }}
              >
                <Info size={20} />
                Detalhes
              </li>
              <li className="py-2 px-4 hover:bg-gray-200 cursor-pointer flex gap-2 items-center" onClick={handleOpenEdit}>
                <Pencil size={20} />
                Editar
              </li>
            </ul>
          </div>
        )}
      </div>

      <Image
        src={product.imgUrl || "/placeholder.png"}
        alt={product.title}
        width={20}
        height={20}
        layout="responsive"
        className="w-full object-contain rounded max-h-[200px]"
      />
      <h3 className="text-gray-800 text-lg font-bold mt-2 mb-2">{product.title}</h3>
      <p className="text-gray-600 line-clamp-2">{product.description}</p>
      <p className={`${product.quantity > 0 ? "text-gray-800" : "text-red-600"} font-semibold mt-1`}>
        {product.quantity > 0 ? `Em estoque: ${product.quantity}` : "Fora de estoque"}
      </p>
      <p className="text-gray-800 font-semibold mt-1">{formatToBRL(product.value)}</p>
    </div>
  );
};

export default ProductCard;
