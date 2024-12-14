import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function DashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesData = cookies().get("auth-token");

  if (!cookiesData) {
    redirect("/login");
  }

  return <>{children}</>;
}
