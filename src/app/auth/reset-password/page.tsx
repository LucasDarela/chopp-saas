"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // Biblioteca para notificações

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`, // Link para onde o usuário será redirecionado
    });

    setLoading(false);

    if (error) {
      toast.error("Erro ao enviar email de recuperação.");
      return;
    }

    toast.success("Email de recuperação enviado! Verifique sua caixa de entrada.");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Esqueci minha senha</h2>
        <p className="text-gray-600 mb-4">Digite seu email e enviaremos um link para redefinir sua senha.</p>
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button className="mt-4 w-full" onClick={handleResetPassword} disabled={loading}>
          {loading ? "Enviando..." : "Enviar Link"}
        </Button>
      </div>
    </div>
  );
}