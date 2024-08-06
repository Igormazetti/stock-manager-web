"use client";
import { PropsWithChildren } from "react";
import Menu from "../Menu/Menu";

export const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="w-full h-[100vh] flex">
      <Menu />
      <section className="flex-1 h-full flex flex-col ml-20">{children}</section>
    </main>
  );
};
