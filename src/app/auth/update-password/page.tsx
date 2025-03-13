"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // Biblioteca para notificações

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      toast.error("Erro ao atualizar senha.");
      return;
    }

    toast.success("Senha atualizada com sucesso! Faça login novamente.");
    router.push("/auth/login");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Redefinir Senha</h2>
        <p className="text-gray-600 mb-4">Digite sua nova senha abaixo.</p>
        <Input type="password" placeholder="Nova Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input type="password" placeholder="Confirmar Nova Senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-2" />
        <Button className="mt-4 w-full" onClick={handleUpdatePassword} disabled={loading}>
          {loading ? "Atualizando..." : "Redefinir Senha"}
        </Button>
      </div>
    </div>
  );
}