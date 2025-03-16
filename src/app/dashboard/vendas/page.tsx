"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash } from "lucide-react";

// Definição do tipo Venda
interface Venda {
  id: string;
  cliente: string;
  numero_documento: string;
  tipo_documento: string;
  condicao_pagamento: string;
  dias_boleto: number;
  produtos: any[];
  total: number;
  frete: number;
  pago: boolean;
  agendamento: {
    data: string;
    horario: string;
    localEntrega: string;
  };
  cpf_cnpj: string; // Adicionado CPF/CNPJ
  numero_nota: string; // Adicionado Número da Nota
  forma_pagamento: string; // Adicionado Forma de Pagamento
  status_entrega: string; // Adicionado Status da Entrega
}

export default function ListarVendas() {
  const router = useRouter();
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [search, setSearch] = useState("");
  const [selectedVenda, setSelectedVenda] = useState<Venda | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  // 🔹 Buscar vendas do Supabase
  useEffect(() => {
    const fetchVendas = async () => {
      const { data, error } = await supabase
        .from("vendas")
        .select<"id, numeroNota, cliente_id, cliente, numero_documento, forma_pagamento, condicao_pagamento, dias_boleto, total, pago">();
  
      if (error) {
        console.error("Erro ao buscar vendas:", error.message);
        return;
      }
  
      if (Array.isArray(data)) { // ✅ Garante que `data` é um array antes de usar
        setVendas(data as unknown as Venda[]);
      } else {
        setVendas([]); // ✅ Evita erros caso `data` seja `null` ou `undefined`
      }
    };
  
    fetchVendas();
  }, []);

  // 🔹 Filtrar vendas conforme pesquisa
  const filteredVendas = search.trim()
    ? vendas.filter(
        (venda) =>
          venda.cliente.toLowerCase().includes(search.toLowerCase()) ||
          venda.numero_documento.includes(search)
      )
    : vendas;

  // 🔹 Abre o modal com detalhes da venda
  const openModal = (venda: Venda) => {
    setSelectedVenda(venda);
    setIsModalOpen(true);
  };

  // 🔹 Fecha o modal
  const closeModal = () => {
    setSelectedVenda(null);
    setIsModalOpen(false);
  };

  // 🔹 Redireciona para edição da venda
  const handleEdit = () => {
    if (selectedVenda) {
      router.push(`/dashboard/vendas/${selectedVenda.id}/editar`);
      closeModal();
    }
  };

  // 🔹 Exclui a venda
  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta venda?")) {
      const { error } = await supabase.from("vendas").delete().eq("id", id);

      if (error) {
        toast.error("Erro ao excluir venda: " + error.message);
      } else {
        toast.success("Venda excluída com sucesso!");
        setVendas(vendas.filter((venda) => venda.id !== id));
        closeModal();
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vendas</h1>
        <Button onClick={() => router.push("/dashboard/vendas/cadastrar")}>
          Registrar Venda
        </Button>
      </div>

      {/* 🔹 Campo de Pesquisa */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Pesquisar por Cliente ou Documento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

{/* 🔹 Tabela de Vendas */}
{/* 🔹 Tabela de Vendas */}
<Table className="bg-white p-6 rounded-lg shadow-md">
  <TableHeader>
    <TableRow>
      <TableHead>Nº</TableHead>
      <TableHead>Cliente</TableHead>
      <TableHead>CPF/CNPJ</TableHead>
      <TableHead>Forma de Pagamento</TableHead>
      <TableHead>Prazo</TableHead>
      <TableHead>Total</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Ações</TableHead>
    </TableRow>
  </TableHeader>

  <TableBody>
    {vendas.length > 0 ? (
      <>
        {vendas.map((venda: Venda) => (
          <TableRow key={venda.id}>
            <TableCell>{venda.numero_nota ?? "N/A"}</TableCell>
            <TableCell>{venda.cliente ?? "Desconhecido"}</TableCell>
            <TableCell>{venda.numero_documento ?? "-"}</TableCell>
            <TableCell>{venda.forma_pagamento ?? "Não informado"}</TableCell>
            <TableCell>
              {(venda.forma_pagamento === "boleto" || venda.forma_pagamento === "cartao") 
                ? `${venda.dias_boleto ?? 12} dias` 
                : "-"}
            </TableCell>
            <TableCell>R$ {venda.total?.toFixed(2) ?? "0,00"}</TableCell>
            <TableCell>{venda.pago ? "Pago" : "Pendente"}</TableCell>
            <TableCell>
              <Button onClick={() => openModal(venda)}>Ver Detalhes</Button>
            </TableCell>
          </TableRow>
        ))}
      </>
    ) : (
      <TableRow>
        <TableCell colSpan={8} className="text-center py-4">
          Nenhuma venda encontrada.
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>

      {/* 🔹 Modal de Detalhes da Venda */}
{selectedVenda && (
  <Dialog open={isModalOpen} onOpenChange={closeModal}>
    <DialogContent className="max-w-lg w-full bg-white rounded-md shadow-lg p-6">
      <DialogHeader>
        <DialogTitle>Detalhes da Venda</DialogTitle>
      </DialogHeader>
      <div className="space-y-2">
        <p><strong>Número da Nota:</strong> {selectedVenda.numero_nota}</p>
        <p><strong>Cliente:</strong> {selectedVenda.cliente}</p>
        <p><strong>CPF/CNPJ:</strong> {selectedVenda.numero_documento}</p>
        <p><strong>Forma de Pagamento:</strong> {selectedVenda.forma_pagamento}</p>
        <p><strong>Prazo:</strong> {selectedVenda.condicao_pagamento === "boleto" ? `${selectedVenda.dias_boleto} dias` : "-"}</p>
        <p><strong>Total:</strong> R$ {selectedVenda.total.toFixed(2)}</p>
        <p><strong>Status:</strong> {selectedVenda.pago ? "Pago" : "Pendente"}</p>
      </div>
      <DialogFooter className="flex justify-between">
        <Button variant="destructive" onClick={() => handleDelete(selectedVenda.id)}>
          <Trash className="mr-2 h-4 w-4" /> Excluir
        </Button>
        <Button onClick={handleEdit}>
          <Pencil className="mr-2 h-4 w-4" /> Editar Venda
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)}
    
    </div>
  );
}