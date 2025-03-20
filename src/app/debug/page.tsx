"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DebugEmpresa() {
  const [empresa, setEmpresa] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmpresa = async () => {
      const { data: userData, error: userError } = await supabase
        .from("user") // 🔹 Certifique-se de que sua tabela se chama "user" ou "users"
        .select("empresa_id")
        .eq("id", "f0a95093-a638-4e4b-9036-32cf949e142d") // 🔹 Substitua pelo `id` do usuário autenticado
        .maybeSingle();

      if (userError || !userData) {
        console.error("Erro ao buscar empresa:", userError);
        setError("Erro ao carregar empresa.");
      } else {
        console.log("Empresa encontrada:", userData);
        setEmpresa(userData);
      }
    };

    fetchEmpresa();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Debug Empresa</h1>
      {error && <p className="text-red-500">Erro: {error}</p>}
      {empresa ? (
        <pre className="mt-4 p-2 bg-gray-100 rounded">Empresa: {JSON.stringify(empresa, null, 2)}</pre>
      ) : (
        <p className="text-red-500">Nenhuma empresa encontrada para esse usuário.</p>
      )}
    </div>
  );
}