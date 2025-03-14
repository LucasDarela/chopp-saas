"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, Users, Package, Truck, Calendar, Beer, Cog, NotepadText } from "lucide-react";
import Link from "next/link";

export default function SideBar() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/auth/login");
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col fixed h-full">
        <h1 className="text-2xl font-bold mb-6">Chopp SaaS</h1>
        <nav className="flex flex-col space-y-4">
          <Link href="/dashboard" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </Link>
          <Link href="/dashboard/clientes" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
            <Users size={20} /> <span>Clientes</span>
          </Link>
          <Link href="/dashboard/produtos" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
            <Users size={20} /> <span>Produtos</span>
          </Link>
          <Link href="/dashboard/vendas" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
            <Beer size={20} /> <span>Vendas</span>
          </Link>
          <Link href="/dashboard/estoque" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
            <Package size={20} /> <span>Estoque</span>
          </Link>
          <Link href="/dashboard/entregas" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
            <Truck size={20} /> <span>Entregas</span>
          </Link>
          <Link href="/dashboard/relatorios" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
            <NotepadText size={20} /> <span>Relatórios</span>
          </Link>
          <Link href="/dashboard/configuracoes" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
            <Cog size={20} /> <span>Configurações</span>
          </Link>
        </nav>
        <div className="mt-auto">
          <Button onClick={handleLogout} variant="secondary" className="w-full flex items-center justify-center" disabled={loading}>
            <LogOut size={20} className="mr-2" /> {loading ? "Saindo..." : "Logout"}
          </Button>
        </div>
      </aside>
      </div>

  );
}