"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

export default function CadastrarVenda() {
  const router = useRouter();
  const [venda, setVenda] = useState({
    cliente: "",
    produto: "",
    quantidade: "",
    total: "",
    agendamento: false,
    dataAgendada: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVenda({ ...venda, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!venda.cliente || !venda.produto || !venda.quantidade || !venda.total) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    if (venda.agendamento && !venda.dataAgendada) {
      toast.error("Informe a data do agendamento!");
      return;
    }

    toast.success("Venda registrada com sucesso!");
    router.push("/dashboard/vendas");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Registrar Venda</h1>
      <Input type="text" name="cliente" placeholder="Nome do Cliente" value={venda.cliente} onChange={handleChange} className="mt-2" />
      <Input type="text" name="produto" placeholder="Produto" value={venda.produto} onChange={handleChange} className="mt-2" />
      <Input type="number" name="quantidade" placeholder="Quantidade" value={venda.quantidade} onChange={handleChange} className="mt-2" />
      <Input type="text" name="total" placeholder="Total (R$)" value={venda.total} onChange={handleChange} className="mt-2" />
      
      <div className="flex items-center mt-4">
        <Checkbox id="agendamento" checked={venda.agendamento} onCheckedChange={(checked) => setVenda({ ...venda, agendamento: checked as boolean })} />
        <label htmlFor="agendamento" className="ml-2">Agendar Entrega</label>
      </div>
      {venda.agendamento && (
        <Input type="date" name="dataAgendada" placeholder="Data de Agendamento" value={venda.dataAgendada} onChange={handleChange} className="mt-2" />
      )}

      <Button className="mt-4 w-full" onClick={handleSubmit}>Registrar Venda</Button>
    </div>
  );
}
