import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookiesData = cookieStore.get("auth-token");

  if (!cookiesData) {
    redirect("/");
  }

  return <>{children}</>;
}
