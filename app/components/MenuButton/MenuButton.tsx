import { usePathname, useRouter } from "next/navigation";
import {
  Package, Money
} from "phosphor-react";

interface IMenuButton {
  path: string;
  isOpen: boolean;
}

export default function MenuButton({ path, isOpen }: IMenuButton) {
  const pathname = usePathname();
  const router = useRouter();

  console.log(isOpen);

  const getIcon = () => {
    switch (path) {
      case "products":
        return <Package size={32} />;
      case "sales":
        return <Money size={32} />;
    }
  }

  const getButtonText = () => {
    switch (path) {
      case "products":
        return "Produtos";
      case "sales":
        return "Vendas";
    }
  }

  const handleClick = (path: string) => {
    if (!pathname.includes(path)) {
      router.push(`/dashboard/${path}`);
    }
  }

  const isActive = (path: string) => {
    return pathname.includes(path);
  }

  return (
    !isOpen ? (
    <button
    onClick={() => handleClick(pathname)}    
    className={
      isActive(pathname)
        ? "bg-blue-600 text-white rounded-md h-10 w-[90%] flex justify-center items-center"
        : ""
    }
  >
    {getIcon()}
  </button>
  ) : (
    <button
    onClick={() => handleClick(pathname)}    
    className={
      isActive(pathname)
        ? "bg-blue-600 text-white rounded-md h-10 w-[90%] flex justify-center items-center"
        : ""
    }
  >
    {getButtonText() || ""}
  </button>
  )
)

}