"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

export default function EditarFornecedor() {
  const router = useRouter();
  const { id } = useParams();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [fornecedor, setFornecedor] = useState({
    document: "",
    name: "",
    fantasy_name: "",
    cep: "",
    address: "",
    bairro: "",
    city: "",
    state: "",
    numero: "",
    complemento: "",
    phone: "",
    email: "",
    state_registration: "",
  });

  // 🔹 Mapeamento dos placeholders personalizados
  const placeholdersMap: Record<string, string> = {
    document: "CNPJ",
    name: "Razão Social",
    fantasy_name: "Nome Fantasia",
    cep: "CEP",
    address: "Endereço",
    bairro: "Bairro",
    city: "Cidade",
    state: "Estado",
    numero: "Número",
    complemento: "Complemento",
    phone: "Telefone",
    email: "Email (Opcional)",
    state_registration: "Inscrição Estadual",
  };

  const formatarMaiusculo = (valor: string, campo: string) => {
    return campo === "email" ? valor : valor.toUpperCase();
  };

  // 🔹 Buscar Fornecedor no Supabase
  useEffect(() => {
    const fetchFornecedor = async () => {
      if (!id) return;

      console.log("🔍 Buscando fornecedor ID:", id);

      const { data, error } = await supabase.from("fornecedores").select("*").eq("id", id).single();

      if (error || !data) {
        toast.error("Erro ao carregar fornecedor");
        console.error("❌ Erro ao buscar fornecedor:", error?.message);
      } else {
        console.log("✅ Fornecedor encontrado:", data);

        setFornecedor({
          ...data,
          name: formatarMaiusculo(data.name || "", "name"),
          fantasy_name: formatarMaiusculo(data.fantasy_name || "", "fantasy_name"),
          address: formatarMaiusculo(data.address || "", "address"),
          bairro: formatarMaiusculo(data.bairro || "", "bairro"),
          city: formatarMaiusculo(data.city || "", "city"),
          state: formatarMaiusculo(data.state || "", "state"),
          state_registration: formatarMaiusculo(data.state_registration || "", "state_registration"),
        });
      }
      setLoading(false);
    };

    fetchFornecedor();
  }, [id]);

  // 🔹 Atualiza os dados ao digitar
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: rawValue } = e.target;
    const formattedValue =
      name === "phone"
        ? formatarTelefone(rawValue)
        : name === "email"
        ? rawValue.trim()
        : formatarMaiusculo(rawValue, name);

    setFornecedor((prevFornecedor) => ({
      ...prevFornecedor,
      [name]: formattedValue,
    }));
  };

  // 🔹 Pula para o próximo campo ao pressionar Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  // 🔹 Buscar Endereço pelo CEP ao sair do campo
  const buscarEndereco = async () => {
    if (!fornecedor.cep || fornecedor.cep.length !== 8) return;

    try {
      const { data } = await axios.get(`https://viacep.com.br/ws/${fornecedor.cep}/json/`);
      if (data.erro) {
        toast.error("CEP inválido!");
        setFornecedor((prev) => ({ ...prev, address: "", bairro: "", city: "", state: "" }));
      } else {
        setFornecedor((prev) => ({
          ...prev,
          address: formatarMaiusculo(data.logradouro || "", "address"),
          bairro: formatarMaiusculo(data.bairro || "", "bairro"),
          city: formatarMaiusculo(data.localidade || "", "city"),
          state: formatarMaiusculo(data.uf || "", "state"),
        }));
      }
    } catch (error) {
      toast.error("Erro ao buscar endereço!");
    }
  };

  // 🔹 Atualizar Fornecedor no Supabase
  const handleUpdate = async () => {
    const { error } = await supabase.from("fornecedores").update(fornecedor).eq("id", id);

    if (error) {
      toast.error("Erro ao atualizar fornecedor: " + error.message);
    } else {
      toast.success("Fornecedor atualizado com sucesso!");
      router.push("/dashboard/fornecedores");
    }
  };

  // 🔹 Formatar telefone corretamente
  const formatarTelefone = (valor: string) => {
    let telefone = valor.replace(/\D/g, "").slice(0, 11);
    if (telefone.length >= 3) {
      telefone = `(${telefone.slice(0, 2)}) ${telefone.slice(2)}`;
    }
    return telefone;
  };

  if (loading) {
    return <p className="text-center text-gray-500">Carregando fornecedor...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Editar Fornecedor</h1>

      {/* 🔹 Campos do formulário */}
      {Object.keys(placeholdersMap).map((campo, index) => (
        <Input
          key={campo}
          type={campo === "email" ? "email" : "text"}
          name={campo}
          placeholder={placeholdersMap[campo]}
          value={fornecedor[campo as keyof typeof fornecedor]}
          onChange={handleChange}
          onBlur={campo === "cep" ? buscarEndereco : undefined}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="mt-2"
          disabled={campo === "document"} // Não permitir edição do CNPJ
        />
      ))}

      <Button className="mt-4 w-full" onClick={handleUpdate}>Atualizar</Button>
    </div>
  );
}