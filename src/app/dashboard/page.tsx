"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, loading } = useAuth()!;
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (!user) return <p>Sem conexão com o Supabase.</p>;

  return <h1>Bem-vindo ao Painel!</h1>;
}