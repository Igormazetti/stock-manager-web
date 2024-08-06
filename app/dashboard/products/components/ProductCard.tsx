import React from "react";
import { Product } from "@/app/interfaces/product";
import Image from "next/image";
import { formatToBRL } from "@/app/utils/currency";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white p-4 rounded shadow-lg">
      <Image
        src={product.imgUrl || "/placeholder.png"}
        alt={product.title}
        width={20}
        height={20}
        layout="responsive"
        className="w-full object-contain rounded max-h-[200px]"
      />
      <h3 className="text-gray-800 text-lg font-bold mt-2 mb-2">{product.title}</h3>
      <p className="text-gray-600 line-clamp-3">{product.description}</p>
      <p className="text-gray-800 font-semibold mt-1">{formatToBRL(product.value)}</p>
    </div>
  );
};

export default ProductCard;
