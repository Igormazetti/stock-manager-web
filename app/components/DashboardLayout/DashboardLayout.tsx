"use client";
import React, { PropsWithChildren } from "react";
import Menu from "../Menu/Menu";
import Header from "../Header/Header";

export const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="w-full h-[100vh] flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Menu />
        <section className="flex-1 h-full flex flex-col ml-20 overflow-auto">
          {children}
        </section>
      </div>
    </main>
  );
};
