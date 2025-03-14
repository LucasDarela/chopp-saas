"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CadastrarProduto() {
  const router = useRouter();
  const [produto, setProduto] = useState({
    nome: "",
    categoria: "",
    preco: "",
    estoque: "",
    descricao: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduto({ ...produto, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!produto.nome || !produto.categoria || !produto.preco || !produto.estoque) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    toast.success("Produto cadastrado com sucesso!");
    router.push("/dashboard/produtos");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cadastrar Produto</h1>
      <Input type="text" name="nome" placeholder="Nome do Produto" value={produto.nome} onChange={handleChange} className="mt-2" />
      <Input type="text" name="categoria" placeholder="Categoria" value={produto.categoria} onChange={handleChange} className="mt-2" />
      <Input type="text" name="preco" placeholder="Preço" value={produto.preco} onChange={handleChange} className="mt-2" />
      <Input type="number" name="estoque" placeholder="Estoque" value={produto.estoque} onChange={handleChange} className="mt-2" />
      <Input type="text" name="descricao" placeholder="Descrição (Opcional)" value={produto.descricao} onChange={handleChange} className="mt-2" />
      
      <Button className="mt-4 w-full" onClick={handleSubmit}>Cadastrar Produto</Button>
    </div>
  );
}