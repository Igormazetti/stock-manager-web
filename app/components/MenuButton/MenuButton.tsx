import { usePathname, useRouter } from "next/navigation";
import { Package, Money, Users, Receipt } from "phosphor-react";
import { colors } from "@/app/styles/colors";

interface IMenuButton {
  path: string;
  isOpen: boolean;
}

export default function MenuButton({ path, isOpen }: IMenuButton) {
  const pathname = usePathname();
  const router = useRouter();

  const getIcon = () => {
    switch (path) {
      case "products":
        return <Package size={32} />;
      case "sales":
        return <Money size={32} />;
      case "clients":
        return <Users size={32} />;
      case "cobrancas":
        return <Receipt size={32} />;
    }
  };

  const getButtonText = () => {
    switch (path) {
      case "products":
        return "Produtos";
      case "sales":
        return "Vendas";
      case "clients":
        return "Clientes";
      case "cobrancas":
        return "Cobranças";
    }
  };

  const handleClick = () => {
    if (!pathname.includes(path)) {
      router.push(`/dashboard/${path}`);
    }
  };

  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  return !isOpen ? (
    <button
      onClick={() => handleClick()}
      className="rounded-md h-10 w-[90%] flex justify-center items-center transition-colors"
      style={{
        backgroundColor: isActive(pathname) ? colors.petrolBlue : "transparent",
        color: isActive(pathname) ? colors.white : colors.petrolBlue,
      }}
      onMouseEnter={(e) => {
        if (!isActive(pathname)) {
          e.currentTarget.style.backgroundColor = colors.petrolBlueMist;
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive(pathname)) {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      {getIcon()}
    </button>
  ) : (
    <button
      onClick={() => handleClick()}
      className="rounded-md h-10 w-[90%] flex justify-center items-center transition-colors"
      style={{
        backgroundColor: isActive(pathname) ? colors.petrolBlue : "transparent",
        color: isActive(pathname) ? colors.white : colors.petrolBlue,
      }}
      onMouseEnter={(e) => {
        if (!isActive(pathname)) {
          e.currentTarget.style.backgroundColor = colors.petrolBlueMist;
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive(pathname)) {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      {getButtonText() || ""}
    </button>
  );
}
