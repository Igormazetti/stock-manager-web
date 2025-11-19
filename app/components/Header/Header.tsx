"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import { colors } from "@/app/styles/colors";
import { useNotifications } from "@/app/hooks/useNotifications";
import NotificationsModal from "@/app/components/NotificationsModal/NotificationsModal";
import { Package, ShoppingCart } from "phosphor-react";

export default function Header() {
  const [company, setCompany] = useState<any>(null);
  const [isProductNotificationsOpen, setIsProductNotificationsOpen] = useState(false);
  const [isSalesNotificationsOpen, setIsSalesNotificationsOpen] = useState(false);
  const {
    notificationsProduct,
    notificationsSales,
    hasMore,
    isLoading,
    loadMore,
  } = useNotifications();

  useEffect(() => {
    // Read company data from cookies on mount
    const cookieData = Cookies.get("company");
    const companyData = cookieData ? JSON.parse(cookieData) : null;
    setCompany(companyData);

    // Listen for storage changes (for logo updates from settings modal)
    const handleStorageChange = () => {
      const updatedCookie = Cookies.get("company");
      const updatedData = updatedCookie ? JSON.parse(updatedCookie) : null;
      setCompany(updatedData);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const unreadProductCount = notificationsProduct.filter(
    (notification) => !notification.readed
  ).length;
  const unreadSalesCount = notificationsSales.filter(
    (notification) => !notification.readed
  ).length;

  const handleLoadMoreProducts = async () => {
    await loadMore("PRODUCTS");
  };

  const handleLoadMoreSales = async () => {
    await loadMore("SALES");
  };

  return (
    <header
      className="w-full py-4 px-6 border-b shadow-sm"
      style={{
        backgroundColor: colors.white,
        borderColor: colors.lineBorder,
      }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo and Company Name */}
        <div className="flex items-center gap-4">
          {company?.logoUrl ? (
            <div
              className="flex items-center justify-center rounded-lg p-2 flex-shrink-0"
              style={{
                backgroundColor: colors.petrolBlueMist,
                width: "56px",
                height: "56px",
              }}
            >
              {company.logoUrl.startsWith("data:") ? (
                <img
                  src={company.logoUrl}
                  alt={company.name || "Company Logo"}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Image
                  src={company.logoUrl}
                  alt={company.name || "Company Logo"}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              )}
            </div>
          ) : (
            <div
              className="flex items-center justify-center rounded-lg font-bold text-lg flex-shrink-0"
              style={{
                backgroundColor: colors.petrolBlue,
                width: "56px",
                height: "56px",
                color: colors.white,
              }}
            >
              {company?.name?.charAt(0) || "C"}
            </div>
          )}

          <div className="flex flex-col">
            <h1
              className="text-xl font-bold"
              style={{ color: colors.graphite }}
            >
              {company?.name || "Minha Empresa"}
            </h1>
         
          </div>
        </div>

        {/* Notifications */}
        <div className="flex items-center gap-4">
          {/* Products Notifications Button */}
          <button
            onClick={() => setIsProductNotificationsOpen(true)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Notificações de Produtos"
          >
            <Package size={24} color={colors.petrolBlue} />
            {unreadProductCount > 0 && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadProductCount}
              </div>
            )}
          </button>

          {/* Sales Notifications Button */}
          <button
            onClick={() => setIsSalesNotificationsOpen(true)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Notificações de Vendas"
          >
            <ShoppingCart size={24} color={colors.petrolBlue} />
            {unreadSalesCount > 0 && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadSalesCount}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Notifications Modals */}
      <NotificationsModal
        isOpen={isProductNotificationsOpen}
        onClose={() => setIsProductNotificationsOpen(false)}
        notifications={notificationsProduct}
        entity="PRODUCTS"
        title="Notificações de Produtos"
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={handleLoadMoreProducts}
      />

      <NotificationsModal
        isOpen={isSalesNotificationsOpen}
        onClose={() => setIsSalesNotificationsOpen(false)}
        notifications={notificationsSales}
        entity="SALES"
        title="Notificações de Vendas"
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={handleLoadMoreSales}
      />
    </header>
  );
}
