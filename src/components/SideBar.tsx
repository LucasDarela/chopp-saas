"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  Users,
  Package,
  Truck,
  NotepadText,
  Cog,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Beer,
  Wallet,
  Calendar,
  ScrollText,
  Wheat,
  Factory,
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Sidebar({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean; setIsCollapsed: (value: boolean) => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const userAvatar = user.user_metadata?.avatar_url || "";
        setAvatarUrl(`${userAvatar}?t=${new Date().getTime()}`);
      }
      const handleResize = () => {
        if (window.innerWidth < 1024) {
          setIsCollapsed(true); // Sempre colapsado em telas menores que `lg`
        }
      };
  
      handleResize(); // Chama a função ao montar o componente
      window.addEventListener("resize", handleResize);
  
      return () => window.removeEventListener("resize", handleResize);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/auth/login");
    setLoading(false);
  };

  return (
    <aside
      className={clsx(
        "bg-white shadow-md p-4 flex flex-col fixed h-full border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Botão para colapsar a Sidebar */}
      <button
        className="absolute -right-4 bottom-18 bg-gray-200 rounded-full p-1 shadow-md hidden lg:flex"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Informações do Usuário */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-all">
        <Avatar>
        <AvatarImage src={avatarUrl || "https://via.placeholder.com/150"} alt="Avatar" />
        <AvatarFallback>{user?.user_metadata?.full_name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col text-left">
            <span className="font-bold">{user?.user_metadata?.full_name || "Usuário"}</span>
            <span className="text-sm text-gray-500">{user?.email || "email@example.com"}</span>
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent> 
        <Link href="/dashboard/upgrade"><DropdownMenuItem>Upgrade to Pro</DropdownMenuItem></Link>
          <Link href="/dashboard/conta"><DropdownMenuItem>Conta</DropdownMenuItem></Link>
          <Link href="/dashboard/pagamento"><DropdownMenuItem>Pagamento</DropdownMenuItem></Link>
          <Link href="/dashboard/notificacoes"><DropdownMenuItem>Notificações</DropdownMenuItem></Link>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut size={16} className="mr-2" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Seção de Navegação */}
      <div className="mt-6">
        <h3 className="text-[12px] tracking-tighter text-gray-400 mb-2 px-2">Admin</h3>
        <SidebarItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" collapsed={isCollapsed} />
        <SidebarItem href="/dashboard/clientes" icon={<Users size={20} />} label="Clientes" collapsed={isCollapsed} />
        <SidebarItem href="/dashboard/fornecedores" icon={<Factory size={20} />} label="Fornecedores" collapsed={isCollapsed} />
        <SidebarItem href="/dashboard/produtos" icon={<Wheat size={20} />} label="Produtos" collapsed={isCollapsed} />
        <SidebarItem href="/dashboard/financeiro" icon={<Wallet size={20} />} label="Financeiro" collapsed={isCollapsed} />

        <h3 className="text-[12px] tracking-tighter tracking-tighter text-gray-400 mt-4 mb-2 px-2">Gestão</h3>
        <SidebarItem href="/dashboard/vendas" icon={<Beer size={20} />} label="Vendas" collapsed={isCollapsed} />
        <SidebarItem href="/dashboard/inventario" icon={<NotepadText size={20} />} label="Inventário" collapsed={isCollapsed} />
        <SidebarItem href="/dashboard/entregas" icon={<Truck size={20} />} label="Delivery" collapsed={isCollapsed} />
        <SidebarItem href="/dashboard/agendamentos" icon={<Calendar size={20} />} label="Agendamentos" collapsed={isCollapsed} />
        <SidebarItem href="/dashboard/relatorios" icon={<ScrollText size={20} />} label="Relatórios" collapsed={isCollapsed} />

      </div>

      {/* Configurações e Logout */}
      <div className="mt-auto">
        <SidebarItem href="/dashboard/configuracoes" icon={<Cog size={20} />} label="Configurações" collapsed={isCollapsed} />
      </div>
    </aside>
  );
}

// 🔹 Componente reutilizável para os itens da Sidebar
interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

function SidebarItem({ href, icon, label, collapsed }: SidebarItemProps) {
  return (
    <Link href={href} className={clsx(
      "flex items-center space-x-2 p-3 hover:bg-gray-200 rounded-md transition-all duration-300",
      collapsed ? "justify-center" : ""
    )}>
      {icon}
      {!collapsed && <span className="transition-opacity duration-300">{label}</span>}
    </Link>
  );
}