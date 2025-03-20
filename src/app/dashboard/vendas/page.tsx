"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash } from "lucide-react";
import { format } from "date-fns";

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
        .select("id, cliente_id, cliente, numero_documento, numero_nota, forma_pagamento, condicao_pagamento, dias_boleto, total, pago");
  
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

      {/* Table */}
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
    </TableRow>
  </TableHeader>

  <TableBody>
    {vendas.length > 0 ? (
      vendas.map((venda: Venda) => (
        <TableRow
          key={venda.id}
          className="cursor-pointer hover:bg-gray-100"
          onClick={() => openModal(venda)} // 🔹 Abre o modal ao clicar na linha
        >
          <TableCell>{venda.numero_nota ?? "N/A"}</TableCell>
          <TableCell>{venda.cliente ?? "Desconhecido"}</TableCell>
          <TableCell>{venda.numero_documento ?? "-"}</TableCell>
          <TableCell>{venda.forma_pagamento ?? "Não informado"}</TableCell>
          <TableCell>
            {(venda.forma_pagamento === "boleto" || venda.forma_pagamento === "cartao") 
              ? `${venda.dias_boleto ?? 12} dias` 
              : "-"}
          </TableCell>
          <TableCell>R$ {(Number(venda.total) || 0).toFixed(2)}</TableCell>
          <TableCell>{venda.pago ? "Pago" : "Pendente"}</TableCell>
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={7} className="text-center py-4">
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
      <p><strong>Número da Nota:</strong> {selectedVenda.numero_nota ? selectedVenda.numero_nota : "Não informado"}</p>
        <p><strong>Cliente:</strong> {selectedVenda.cliente}</p>
        <p><strong>CPF/CNPJ:</strong> {selectedVenda.numero_documento}</p>

        <p><strong>Forma de Pagamento:</strong> {selectedVenda.forma_pagamento}</p>
        <p><strong>Prazo:</strong> {selectedVenda.condicao_pagamento === "boleto" ? `${selectedVenda.dias_boleto} dias` : "À vista"}</p>
        <p><strong>Frete:</strong> R$ {(Number(selectedVenda.frete) || 0).toFixed(2)}</p>
        <p><strong>Total:</strong> R$ {selectedVenda.total.toFixed(2)}</p>
 {/* 🔹 Agendamento - Data, Horário e Local */}
        <p><strong>Data de Entrega:</strong> {selectedVenda.agendamento?.data ? format(new Date(selectedVenda.agendamento.data), "dd/MM/yyyy") : "Não definido"}</p>
        <p><strong>Horário:</strong> {selectedVenda.agendamento?.horario ?? "Não informado"}</p>
        <p><strong>Local de Entrega:</strong> {selectedVenda.agendamento?.localEntrega ?? "Não informado"}</p>

                {/* 🔹 Exibir Produtos Vendidos */}
                <p><strong>Produtos Vendidos:</strong> </p>
        {selectedVenda.produtos && selectedVenda.produtos.length > 0 ? (
          <ul className="list-disc ml-6">
            {selectedVenda.produtos.map((produto, index) => (
              <li key={index}>
                {produto.nome} - {produto.quantidade}x - R$ {(Number(produto.preco) || 0).toFixed(2)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Nenhum produto registrado.</p>
        )}
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