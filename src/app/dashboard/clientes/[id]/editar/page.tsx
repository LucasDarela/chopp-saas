"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditarClientePage() {
  const router = useRouter();
  const { id } = useParams();
  const [cliente, setCliente] = useState({
    nome: "",
    tipo: "",
    documento: "",
    cep: "",
    endereco: "",
    telefone: "",
    email: "",
  });

  useEffect(() => {
    // Simulação: Buscar dados do cliente (trocar por integração com Supabase)
    const fetchCliente = async () => {
      try {
        const response = await axios.get(`/api/clientes/${id}`); // Ajuste para seu backend
        setCliente(response.data);
      } catch (error) {
        toast.error("Erro ao buscar dados do cliente");
        router.push("/dashboard/clientes");
      }
    };

    if (id) fetchCliente();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // Simulação: Atualizar cliente (trocar por integração com Supabase)
      await axios.put(`/api/clientes/${id}`, cliente);
      toast.success("Cliente atualizado com sucesso!");
      router.push("/dashboard/clientes");
    } catch (error) {
      toast.error("Erro ao atualizar cliente");
    }
  };

  return (
    <div>
      {/* Breadcrumb e Voltar */}
      <div className="flex items-center space-x-2 mb-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/clientes")}> 
          <ArrowLeft size={20} />
        </Button>
        <nav className="text-gray-500">
          <Link href="/dashboard">Dashboard</Link> / 
          <Link href="/dashboard/clientes" className="ml-1">Clientes</Link> / 
          <span className="ml-1 text-black">Editar Cliente</span>
        </nav>
      </div>
      
      <h1 className="text-2xl font-bold mb-4">Editar Cliente</h1>
      <Input type="text" name="nome" placeholder="Nome" value={cliente.nome} onChange={handleChange} className="mt-2" />
      <Input type="text" name="documento" placeholder={cliente.tipo === "CPF" ? "CPF" : "CNPJ"} value={cliente.documento} disabled className="mt-2" />
      <Input type="text" name="cep" placeholder="CEP" value={cliente.cep} onChange={handleChange} className="mt-2" />
      <Input type="text" name="endereco" placeholder="Endereço" value={cliente.endereco} onChange={handleChange} className="mt-2" />
      <Input type="text" name="telefone" placeholder="Telefone" value={cliente.telefone} onChange={handleChange} className="mt-2" />
      <Input type="email" name="email" placeholder="Email (Opcional)" value={cliente.email} onChange={handleChange} className="mt-2" />
      
      <Button className="mt-4 w-full" onClick={handleSave}>Salvar Alterações</Button>
    </div>
  );
}
