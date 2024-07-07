import { DashboardLayout } from "../components/DashboardLayout/DashboardLayout";

export default function DashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
