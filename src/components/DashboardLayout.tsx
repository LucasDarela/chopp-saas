"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/SideBar"; // Certifique-se de que o caminho está correto.
import Breadcrumb from "./Breadcrumb";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <Breadcrumb />
        </header>

        {/* Conteúdo Dinâmico */}
        <main className="p-6 overflow-auto h-full">{children}</main>
      </div>
    </div>
  );
}