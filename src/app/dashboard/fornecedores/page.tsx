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

// 🔹 Definição do tipo Fornecedor
type Fornecedor = {
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

export default function ListarFornecedores() {
  const router = useRouter();
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedFornecedor, setSelectedFornecedor] = useState<Fornecedor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔹 Buscar fornecedores no Supabase
  useEffect(() => {
    const fetchFornecedores = async () => {
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Erro ao buscar fornecedores:", error.message);
      } else {
        setFornecedores(data || []);
      }
    };

    fetchFornecedores();
  }, []);

  // 🔹 Normaliza texto (remove acentos e converte para minúsculas)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  // 🔹 Filtrar fornecedores diretamente na renderização
  const filteredFornecedores = fornecedores.filter((fornecedor) => {
    const searchTerm = normalizeText(search);
    const nomeFornecedor = normalizeText(fornecedor.name);
    const cpfCnpj = fornecedor.document.replace(/\D/g, "");
    const telefone = fornecedor.phone.replace(/\D/g, "");

    return (
      nomeFornecedor.includes(searchTerm) ||
      cpfCnpj.includes(search.replace(/\D/g, "")) ||
      telefone.includes(search.replace(/\D/g, ""))
    );
  });

  // 🔹 Abre o modal com os detalhes do fornecedor
  const openModal = (fornecedor: Fornecedor) => {
    setSelectedFornecedor(fornecedor);
    setIsModalOpen(true);
  };

  // 🔹 Fecha o modal
  const closeModal = () => {
    setSelectedFornecedor(null);
    setIsModalOpen(false);
  };

  // 🔹 Redireciona para edição
  const handleEdit = () => {
    if (selectedFornecedor) {
      router.push(`/dashboard/fornecedores/${selectedFornecedor.id}/editar`);
      closeModal();
    }
  };

  // 🔹 Exclui fornecedor
  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este fornecedor?")) {
      const { error } = await supabase.from("fornecedores").delete().eq("id", id);

      if (error) {
        toast.error("Erro ao excluir fornecedor: " + error.message);
      } else {
        toast.success("Fornecedor excluído com sucesso!");
        setFornecedores(fornecedores.filter((fornecedor) => fornecedor.id !== id));
      }
    }
  };

  return (
    <div>
      {/* 🔹 Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Fornecedores</h1>
        <Button onClick={() => router.push("/dashboard/fornecedores/cadastrar")} className="w-full sm:w-auto">
          Adicionar Fornecedor
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

      {/* 🔹 Tabela de Fornecedores Responsiva */}
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
            {filteredFornecedores.length > 0 ? (
              filteredFornecedores.map((fornecedor) => (
                <TableRow key={fornecedor.id} onClick={() => openModal(fornecedor)} className="cursor-pointer hover:bg-gray-100">
                  <TableCell>{fornecedor.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{fornecedor.type}</TableCell>
                  <TableCell className="hidden md:table-cell">{fornecedor.document}</TableCell>
                  <TableCell className="hidden md:table-cell">{fornecedor.phone}</TableCell>
                  <TableCell className="hidden md:table-cell">{fornecedor.city}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Nenhum fornecedor encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 🔹 Modal de Detalhes do Fornecedor */}
      {selectedFornecedor && (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent className="max-w-lg w-full">
            <DialogHeader>
              <DialogTitle>Detalhes do Fornecedor</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p><strong>Nome:</strong> {selectedFornecedor.name}</p>
              {selectedFornecedor.fantasy_name && <p><strong>Nome Fantasia:</strong> {selectedFornecedor.fantasy_name}</p>}
              <p><strong>Tipo:</strong> {selectedFornecedor.type}</p>
              <p><strong>Documento:</strong> {selectedFornecedor.document}</p>
              <p><strong>Telefone:</strong> {selectedFornecedor.phone}</p>
              <p><strong>CEP:</strong> {selectedFornecedor.cep}</p>
              <p><strong>Endereço:</strong> {[
                selectedFornecedor.address,
                selectedFornecedor.bairro,
                selectedFornecedor.numero
              ].filter(Boolean).join(", ")}</p>
              {selectedFornecedor.complemento && <p><strong>Complemento:</strong> {selectedFornecedor.complemento}</p>}
              <p><strong>Cidade:</strong> {selectedFornecedor.city}</p>
              <p><strong>Estado:</strong> {selectedFornecedor.state}</p>
              <p><strong>Email:</strong> {selectedFornecedor.email || ""}</p>
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="destructive" onClick={() => handleDelete(selectedFornecedor.id)}>
                <Trash className="mr-2 h-4 w-4" /> Excluir
              </Button>
              <Button onClick={handleEdit}>
                <Pencil className="mr-2 h-4 w-4" /> Editar Fornecedor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}