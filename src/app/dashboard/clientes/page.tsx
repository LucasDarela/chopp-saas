"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Pencil, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// 🔹 Definição do tipo Cliente
type Cliente = {
  id: number;
  name: string;
  type: string;
  document: string;
  phone: string;
  cep: string;
  address: string;
  bairro: string;
  city: string;
  state: string;
  numero: string;
  complemento: string;
  email: string;
  state_registration?: string;
  fantasy_name?: string;
};

export default function ListarClientes() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔹 Buscar clientes no Supabase
  useEffect(() => {
    const fetchClientes = async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("name", { ascending: true }); 

      if (error) {
        console.error("Erro ao buscar clientes:", error.message);
      } else {
        setClientes(data || []);
      }
    };

    fetchClientes();
  }, []);

  // 🔹 Normaliza texto (remove acentos e converte para minúsculas)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  // 🔹 Filtrar clientes diretamente no momento da renderização
  const filteredClientes = clientes.filter((cliente) => {
    const searchTerm = normalizeText(search);
    const nomeCliente = normalizeText(cliente.name);
    const cpfCnpj = cliente.document.replace(/\D/g, "");
    const telefone = cliente.phone.replace(/\D/g, "");

    return (
      nomeCliente.includes(searchTerm) ||
      cpfCnpj.includes(search.replace(/\D/g, "")) ||
      telefone.includes(search.replace(/\D/g, ""))
    );
  });

  // 🔹 Abre o modal com os detalhes do cliente
  const openModal = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setIsModalOpen(true);
  };

  // 🔹 Fecha o modal
  const closeModal = () => {
    setSelectedCliente(null);
    setIsModalOpen(false);
  };

  // 🔹 Redireciona para edição
  const handleEdit = () => {
    if (selectedCliente) {
      router.push(`/dashboard/clientes/${selectedCliente.id}/editar`);
      closeModal();
    }
  };

  // 🔹 Exclui cliente
  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      const { error } = await supabase.from("clients").delete().eq("id", id);

      if (error) {
        toast.error("Erro ao excluir cliente: " + error.message);
      } else {
        toast.success("Cliente excluído com sucesso!");
        setClientes(clientes.filter((cliente) => cliente.id !== id));
      }
    }
  };

  return (
    <div>
      {/* 🔹 Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Clientes</h1>
        <Button onClick={() => router.push("/dashboard/clientes/cadastrar")} className="w-full sm:w-auto">
          Adicionar Cliente
        </Button>
      </div>

      {/* 🔹 Campo de Pesquisa */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Pesquisar por Nome, CPF ou Telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

     {/* 🔹 Tabela de Clientes Responsiva */}
     <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto max-w-full">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden md:table-cell">Tipo</TableHead>
              <TableHead className="hidden md:table-cell">CPF/CNPJ</TableHead>
              <TableHead className="hidden md:table-cell">Telefone</TableHead>
              <TableHead className="hidden md:table-cell">Cidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClientes.length > 0 ? (
              filteredClientes.map((cliente) => (
                <TableRow key={cliente.id} onClick={() => openModal(cliente)} className="cursor-pointer hover:bg-gray-100">
                  <TableCell>{cliente.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{cliente.type}</TableCell>
                  <TableCell className="hidden md:table-cell">{cliente.document}</TableCell>
                  <TableCell className="hidden md:table-cell">{cliente.phone}</TableCell>
                  <TableCell className="hidden md:table-cell">{cliente.city}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 🔹 Modal de Detalhes do Cliente */}
      {selectedCliente && (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent className="max-w-lg w-full">
            <DialogHeader>
              <DialogTitle>Detalhes do Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p><strong>Nome:</strong> {selectedCliente.name}</p>
              {selectedCliente.fantasy_name && <p><strong>Nome Fantasia:</strong> {selectedCliente.fantasy_name}</p>}
              <p><strong>Tipo:</strong> {selectedCliente.type}</p>
              <p><strong>Documento:</strong> {selectedCliente.document}</p>
              <p><strong>Telefone:</strong> {selectedCliente.phone}</p>
              <p><strong>CEP:</strong> {selectedCliente.cep}</p>
              <p><strong>Endereço:</strong> {[
                selectedCliente.address,
                selectedCliente.bairro,
                selectedCliente.numero
              ].filter(Boolean).join(", ")}</p>
              {selectedCliente.complemento && <p><strong>Complemento:</strong> {selectedCliente.complemento}</p>}
              <p><strong>Cidade:</strong> {selectedCliente.city}</p>
              <p><strong>Estado:</strong> {selectedCliente.state}</p>
              <p><strong>Email:</strong> {selectedCliente.email || ""}</p>
              {selectedCliente.state_registration && <p><strong>Inscrição Estadual:</strong> {selectedCliente.state_registration}</p>}
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="destructive" onClick={() => handleDelete(selectedCliente.id)}>
                <Trash className="mr-2 h-4 w-4" /> Excluir
              </Button>
              <Button onClick={handleEdit}>
                <Pencil className="mr-2 h-4 w-4" /> Editar Cliente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}