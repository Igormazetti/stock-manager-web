"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import { colors } from "@/app/styles/colors";

export default function Header() {
  const [company, setCompany] = useState<any>(null);

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

        {/* Optional: User info or additional info can go here */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p
              className="text-sm font-medium"
              style={{ color: colors.graphite }}
            >
              Bem-vindo!
            </p>
            <p
              className="text-xs"
              style={{ color: colors.mediumGray }}
            >
              {company?.email || ""}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
