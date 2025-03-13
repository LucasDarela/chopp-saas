"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Novo campo de confirmar senha
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async () => {
    setError("");
    
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // Criar um usuário na tabela "users" no banco de dados
    if (data.user) {
      await supabase.from("users").insert([{ id: data.user.id, name, email, role: "cliente" }]);
    }

    setSuccess(true); // Exibir mensagem de sucesso
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        {success ? (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Cadastro realizado com sucesso!</h2>
            <p className="text-gray-600">Verifique seu email para confirmar sua conta antes de fazer login.</p>
            <Button className="mt-4 w-full" onClick={() => router.push("/auth/login")}>Acessar Login</Button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">Cadastro</h2>
            {error && <p className="text-red-500">{error}</p>}
            <Input type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
            <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" />
            <Input type="password" placeholder="Confirmar Senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-2" />
            <Button className="mt-4 w-full" onClick={handleSignup}>Criar Conta</Button>
            <p className="mt-4 text-sm text-gray-500">
              Já tem uma conta? <a href="/auth/login" className="text-blue-500">Faça login</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}