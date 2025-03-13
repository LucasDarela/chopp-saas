"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou senha inválidos.");
      return;
    }

    router.push("/dashboard"); // Redireciona para o painel após login
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" />
        <Button className="mt-4 w-full" onClick={handleLogin}>Entrar</Button>
        <p className="mt-4 text-sm text-gray-500">
          Não tem uma conta? <a href="/auth/signup" className="text-blue-500">Cadastre-se</a>
        </p>
        <p className="mt-2 text-sm text-gray-500">
        <a href="/auth/reset-password" className="text-blue-500">Esqueci minha senha</a>
        </p>
      </div>
    </div>
  );
}