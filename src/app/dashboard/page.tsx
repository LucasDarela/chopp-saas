"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/auth/login"); // Redireciona se não estiver logado
      }
    };

    checkUser();
  }, [router]);

  return <h1>Bem-vindo ao Dashboard!</h1>;
}