"use client";

import { useState } from "react";
import Sidebar from "@/components/SideBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Conteúdo Principal */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}>
        {/* Header */}


        {/* Conteúdo Dinâmico */}
        <main className="p-6 overflow-auto h-full">{children}</main>
      </div>
    </div>
  );
}