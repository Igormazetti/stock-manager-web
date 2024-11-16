import React from "react";
import { DashboardLayout } from "../components/DashboardLayout/DashboardLayout";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

export default function DashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesData = Cookies.get("auth-token");

  if (!cookiesData) {
    redirect("/login");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
