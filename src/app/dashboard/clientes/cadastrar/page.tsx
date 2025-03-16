"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CadastrarCliente() {
  const router = useRouter();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [cliente, setCliente] = useState({
    type: "CPF",
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
    document: "CPF/CNPJ",
    name: "Nome Completo / Razão Social",
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

  // 🔹 Converter para Maiúsculas (exceto email)
  const formatarMaiusculo = (valor: string, campo: string) => {
    return campo === "email" ? valor : valor.toUpperCase();
  };

  // 🔹 Atualiza os campos conforme o usuário digita
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: rawValue } = e.target;
    const formattedValue =
      name === "phone"
        ? formatarTelefone(rawValue) // 📌 Formata telefone se for o campo "phone"
        : name === "email"
        ? rawValue.trim() // 📌 Mantém email inalterado
        : formatarMaiusculo(rawValue, name); // 📌 Converte para maiúsculo os outros campos
  
    setCliente((prevCliente) => ({
      ...prevCliente,
      [name]: formattedValue,
    }));
  };

  // 🔹 Alterna entre Pessoa Física e Jurídica
  const setTipoCliente = (tipo: "CPF" | "CNPJ") => {
    setCliente({
      type: tipo,
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
  };

  // 🔹 Pula para o próximo campo ao pressionar Enter (corrigido para Nome → CEP)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      let nextIndex = index + 1;

      // 🔹 Ajusta o fluxo para Nome Completo → CEP
      if (cliente.type === "CPF" && index === 1) {
        nextIndex = 3; // Nome Completo (1) → CEP (3)
      } else if (cliente.type === "CNPJ" && index === 1) {
        nextIndex = 2; // Razão Social (1) → Nome Fantasia (2)
      }

      const nextInput = inputRefs.current[nextIndex];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  // 🔹 Busca Endereço pelo CEP
  const buscarEndereco = async () => {
    if (!cliente.cep || cliente.cep.length !== 8) return;

    try {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cliente.cep}/json/`);
      if (data.erro) {
        toast.error("CEP inválido!");
        setCliente((prev) => ({ ...prev, address: "", bairro: "", city: "", state: "" }));
      } else {
        setCliente((prev) => ({
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

  // 🔹 Busca dados da empresa pelo CNPJ
  const buscarCNPJ = async () => {
    // Remove caracteres especiais do CNPJ (ex: "54.429.013/0001-00" → "54429013000100")
    const cnpjLimpo = cliente.document.replace(/\D/g, "");
  
    if (cnpjLimpo.length !== 14) {
      toast.error("CNPJ inválido! Insira um CNPJ com 14 dígitos.");
      return;
    }
  
    try {
      const { data } = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);
  
      if (data) {
        setCliente((prev) => ({
          ...prev,
          name: formatarMaiusculo(data.razao_social || "", "name"),
          fantasy_name: formatarMaiusculo(data.nome_fantasia || "", "fantasy_name"),
          address: formatarMaiusculo(data.logradouro || "", "address"),
          bairro: formatarMaiusculo(data.bairro || "", "bairro"),
          city: formatarMaiusculo(data.municipio || "", "city"),
          state: formatarMaiusculo(data.uf || "", "state"),
          cep: data.cep || "", // ✅ Corrigido: adicionando CEP
          numero: data.numero || "", // ✅ Corrigido: adicionando Número
          complemento: data.complemento || "", // ✅ Corrigido: adicionando Complemento
          phone: data.ddd_telefone_1 && data.telefone_1 ? `(${data.ddd_telefone_1}) ${data.telefone_1}` : "", // ✅ Corrigido telefone
          email: data.email || "", // ✅ Corrigido email
          state_registration: formatarMaiusculo(data.inscricao_estadual || "", "state_registration"),
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CNPJ:", error);
      toast.error("Erro ao buscar CNPJ! Verifique os dados e tente novamente.");
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

// 🔹 Função para validar CPF
const validarCPF = (cpf: string) => {
  cpf = cpf.replace(/\D/g, ""); // Remove tudo que não for número
  if (cpf.length !== 11) return false;
  let sum = 0, remainder;
  if (/^(\d)\1+$/.test(cpf)) return false; // Elimina CPFs inválidos como 111.111.111-11

  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(cpf[10]);
};

// 🔹 Cadastrar Cliente no Supabase
const handleSubmit = async () => {
  if (!cliente.name || !cliente.document) {
    toast.error("Preencha os campos obrigatórios!");
    return;
  }

  // 🔹 Validação de CPF
  if (cliente.type === "CPF" && !validarCPF(cliente.document)) {
    toast.error("CPF inválido!");
    return;
  }

  // 🔹 Verificar se já existe um cliente com esse CPF/CNPJ
  const { data: clienteExistente, error: consultaError } = await supabase
    .from("clients")
    .select("id")
    .eq("document", cliente.document)
    .single();

  if (consultaError && consultaError.code !== "PGRST116") {
    toast.error("Erro ao verificar CPF/CNPJ!");
    return;
  }

  if (clienteExistente) {
    toast.error("Já existe um cliente com esse CPF/CNPJ!");
    return;
  }

  // 🔹 Cadastrar Cliente
  const { error } = await supabase.from("clients").insert([cliente]);

  if (error) {
    toast.error("Erro ao cadastrar cliente: " + error.message);
  } else {
    toast.success("Cliente cadastrado com sucesso!");
    router.push("/dashboard/clientes");
  }
};

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Cadastrar Cliente</h1>

      {/* 🔹 Botões para selecionar CPF ou CNPJ */}
      <div className="flex gap-2 mb-4">
        <Button variant={cliente.type === "CPF" ? "default" : "outline"} onClick={() => setTipoCliente("CPF")}>
          Pessoa Física
        </Button>
        <Button variant={cliente.type === "CNPJ" ? "default" : "outline"} onClick={() => setTipoCliente("CNPJ")}>
          Pessoa Jurídica
        </Button>
      </div>

      {/* 🔹 Campos do formulário */}
      {Object.keys(placeholdersMap).map((campo, index) => {
        if (cliente.type === "CPF" && ["fantasy_name", "state_registration"].includes(campo)) return null;
        return (
          <Input
            key={campo}
            type={campo === "email" ? "email" : "text"}
            name={campo}
            placeholder={placeholdersMap[campo]}
            value={cliente[campo as keyof typeof cliente]}
            onChange={handleChange}
            onBlur={campo === "cep" ? buscarEndereco : campo === "document" && cliente.type === "CNPJ" ? buscarCNPJ : undefined}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => {
              if (el) inputRefs.current[index] = el;
            }}
            className="mt-2"
          />
        );
      })}

      <Button className="mt-4 w-full" onClick={handleSubmit}>Cadastrar</Button>
    </div>
  );
}