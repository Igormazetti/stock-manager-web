import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "@/providers/sessionProvider";
import { Toaster } from "react-hot-toast";
import { NextUIProvider } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stock Manager",
  description: "Manage your stock with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
          <NextAuthSessionProvider>
            <NextUIProvider>
              {children}
              <Toaster position="top-right" />
            </NextUIProvider>
          </NextAuthSessionProvider>
      </body>
    </html>
  );
}
