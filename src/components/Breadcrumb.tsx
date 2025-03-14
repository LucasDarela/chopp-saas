"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Breadcrumb() {
  const pathname = usePathname();
  const router = useRouter();

  // Gerar os breadcrumbs dinamicamente
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);

    return (
      <span key={href} className="text-gray-500 text-sm">
        {index !== 0 && " / "}
        <Link href={href} className="hover:underline">
          {label.replace("dashboard", "Dashboard").replace("clientes", "Clientes")}
        </Link>
      </span>
    );
  });

  return (
    <div className="bg-white shadow-sm p-2 flex items-center space-x-3 fixed top-0 left-64 right-0 z-10 h-10">
      <Button variant="outline" size="icon" className="w-8 h-8" onClick={() => router.back()}> 
        <ArrowLeft size={16} />
      </Button>
      <nav className="text-gray-600 flex items-center">{breadcrumbItems}</nav>
    </div>
  );
}