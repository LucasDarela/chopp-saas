import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button"; // Corrigida a importação do botão

export default function Hero() {
  return (
    <section className="text-center py-20 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
      <h2 className="text-4xl font-bold">Gerencie sua Distribuidora de Chopp com Facilidade</h2>
      <p className="mt-4 text-lg">Automatize vendas, estoque e entregas com nosso sistema SaaS.</p>
      <Button asChild className="mt-6">
        <Link href="/auth/signup">Experimente Agora</Link>
      </Button>
    </section>
  );
}