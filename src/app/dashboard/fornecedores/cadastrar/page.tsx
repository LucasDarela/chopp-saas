"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CadastrarFornecedor() {
  const router = useRouter();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [empresaId, setEmpresaId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmpresaId = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error("❌ Erro ao buscar usuário autenticado:", authError?.message);
        toast.error("Erro ao carregar informações do usuário.");
        return;
      }
      
      const { data: usuario, error: usuarioError } = await supabase
        .from("user")
        .select("empresa_id")
        .eq("email", user.email)
        .maybeSingle();
      
      if (usuarioError || !usuario) {
        console.error("❌ Erro ao buscar empresa do usuário:", usuarioError?.message);
        toast.error("Erro ao carregar dados da empresa.");
        return;
      }
      
      setEmpresaId(usuario.empresa_id);
    };
    fetchEmpresaId();
  }, []);
  
  const [fornecedor, setFornecedor] = useState({
    type: "PJ",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: rawValue } = e.target;
    
    const formattedValue = name === "phone"
      ? formatarTelefone(rawValue)
      : name === "email"
      ? rawValue.trim()
      : formatarMaiusculo(rawValue, name);

    setFornecedor((prevFornecedor) => ({
      ...prevFornecedor,
      [name]: formattedValue,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

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

  const buscarCNPJ = async () => {
    const cnpjLimpo = fornecedor.document.replace(/\D/g, "");
    if (cnpjLimpo.length !== 14) {
      toast.error("CNPJ inválido! Insira um CNPJ com 14 dígitos.");
      return;
    }

    try {
      const { data } = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);

      if (data) {
        setFornecedor((prev) => ({
          ...prev,
          name: formatarMaiusculo(data.razao_social || "", "name"),
          fantasy_name: formatarMaiusculo(data.nome_fantasia || "", "fantasy_name"),
          address: formatarMaiusculo(data.logradouro || "", "address"),
          bairro: formatarMaiusculo(data.bairro || "", "bairro"),
          city: formatarMaiusculo(data.municipio || "", "city"),
          state: formatarMaiusculo(data.uf || "", "state"),
          cep: data.cep || "",
          numero: data.numero || "",
          complemento: data.complemento || "",
          phone: data.ddd_telefone_1 && data.telefone_1 ? `(${data.ddd_telefone_1}) ${data.telefone_1}` : "",
          email: data.email || "",
          state_registration: formatarMaiusculo(data.inscricao_estadual || "", "state_registration"),
        }));
      }
    } catch (error) {
      toast.error("Erro ao buscar CNPJ! Verifique os dados e tente novamente.");
    }
  };

  const formatarTelefone = (valor: string) => {
    let telefone = valor.replace(/\D/g, "").slice(0, 11);
    if (telefone.length >= 3) {
      telefone = `(${telefone.slice(0, 2)}) ${telefone.slice(2)}`;
    }
    return telefone;
  };

  const handleSubmit = async () => {
    if (!fornecedor.name || !fornecedor.document || !empresaId) {
      toast.error("Preencha os campos obrigatórios!");
      return;
    }

    const { data: fornecedorExistente, error: consultaError } = await supabase
      .from("fornecedores")
      .select("id")
      .eq("document", fornecedor.document)
      .eq("empresa_id", empresaId)
      .maybeSingle();

    if (fornecedorExistente) {
      toast.error("Já existe um fornecedor com esse CNPJ!");
      return;
    }

    if (fornecedorExistente) {
      toast.error("Já existe um fornecedor com esse CNPJ!");
      return;
    }

    const { error } = await supabase.from("fornecedores").insert([
      { ...fornecedor, empresa_id: empresaId },
    ]);

    if (error) {
      toast.error("Erro ao cadastrar fornecedor: " + error.message);
    } else {
      toast.success("Fornecedor cadastrado com sucesso!");
      router.push("/dashboard/fornecedores");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Cadastrar Fornecedor</h1>

      {Object.keys(placeholdersMap).map((campo, index) => (
        <Input
          key={campo}
          type={campo === "email" ? "email" : "text"}
          name={campo}
          placeholder={placeholdersMap[campo]}
          value={fornecedor[campo as keyof typeof fornecedor]}
          onChange={handleChange}
          onBlur={campo === "cep" ? buscarEndereco : campo === "document" ? buscarCNPJ : undefined}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => {
            if (el) inputRefs.current[index] = el;
          }}
          className="mt-2"
        />
      ))}

      <Button className="mt-4 w-full" onClick={handleSubmit}>Cadastrar</Button>
    </div>
  );
}