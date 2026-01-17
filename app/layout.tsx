import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import NextAuthSessionProvider from "@/providers/sessionProvider";
import QueryProvider from "@/providers/queryProvider";
import { Toaster } from "react-hot-toast";
import { NextUIProvider } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stock Manager",
  description: "Manage your stock with ease",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <NextAuthSessionProvider>
          <QueryProvider>
            <NextUIProvider>
              {children}
              <Toaster position="top-right" />
            </NextUIProvider>
          </QueryProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
