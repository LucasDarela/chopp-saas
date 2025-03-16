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
import { Card } from "@/components/ui/card";

// 🔹 Definição do tipo Produto
type Produto = {
  id: number;
  codigo: string;
  nome: string;
  fabricante: string;
  preco: string;
  tributos: string;
  classe_material: string;
  sub_classe: string;
  classificacao_fiscal: string;
  origem: string;
  aplicacao: string;
  codigo_comodato?: string;
  estoque: number;
  imagem_url?: string;
};

export default function ListarProdutos() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filteredProdutos, setFilteredProdutos] = useState<Produto[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔹 Buscar produtos no Supabase
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const { data, error } = await supabase
          .from("produtos")
          .select("id, codigo, nome, fabricante, preco, tributos, classe_material, sub_classe, classificacao_fiscal, origem, aplicacao, codigo_comodato, estoque, imagem_url")
          .order("codigo", { ascending: true }); 

        if (error) {
          throw new Error(error.message);
        }

        console.log("✅ Produtos carregados:", data);
        setProdutos(data || []);
        setFilteredProdutos(data || []);
      } catch (error) {
        console.error("❌ Erro ao buscar produtos:", error);
        toast.error("Erro ao carregar produtos.");
      }
    };

    fetchProdutos();
  }, []);

  // 🔹 Filtrar produtos conforme o usuário digita
  useEffect(() => {
    if (!search.trim()) {
      setFilteredProdutos([...produtos]);
      return;
    }

    const searchTerm = search.toLowerCase().trim();

    const newFilteredProdutos = produtos.filter((produto) =>
      produto.nome.toLowerCase().includes(searchTerm) || 
      produto.codigo.toLowerCase().includes(searchTerm) // 🔹 Permite buscar pelo código também
    );

    setFilteredProdutos([...newFilteredProdutos]);
  }, [search, produtos]);

  // 🔹 Abre o modal com os detalhes do produto
  const openModal = (produto: Produto) => {
    setSelectedProduto(produto);
    setIsModalOpen(true);
  };

  // 🔹 Fecha o modal
  const closeModal = () => {
    setSelectedProduto(null);
    setIsModalOpen(false);
  };

  // 🔹 Redireciona para edição
  const handleEdit = () => {
    if (selectedProduto) {
      router.push(`/dashboard/produtos/${selectedProduto.id}/editar`);
      closeModal();
    }
  };

  // 🔹 Exclui produto
  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        const { error } = await supabase.from("produtos").delete().eq("id", id);

        if (error) {
          throw new Error(error.message);
        }

        toast.success("Produto excluído com sucesso!");
        setProdutos(produtos.filter((produto) => produto.id !== id));
        setFilteredProdutos(filteredProdutos.filter((produto) => produto.id !== id));
        closeModal();
      } catch (error) {
        console.error("❌ Erro ao excluir produto:", error);
        toast.error("Erro ao excluir produto.");
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Button onClick={() => router.push("/dashboard/produtos/cadastrar")} className="w-full sm:w-auto">
          Adicionar Produto
        </Button>
      </div>

      {/* 🔹 Campo de Pesquisa */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Pesquisar por Código ou Nome do Produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* 🔹 Tabela de Produtos */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hidden sm:table-row">
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProdutos.length > 0 ? (
              filteredProdutos.map((produto) => (
                <TableRow key={produto.id} onClick={() => openModal(produto)} className="cursor-pointer hover:bg-gray-100">
                  <TableCell className="block sm:table-cell">{produto.codigo}</TableCell>
                  <TableCell>{produto.nome}</TableCell>
                  <TableCell className="hidden sm:table-cell">{produto.classe_material || "N/A"}</TableCell>
                  <TableCell className="hidden sm:table-cell">{produto.preco}</TableCell>
                  <TableCell className="hidden sm:table-cell">{produto.estoque}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 🔹 Modal de Detalhes do Produto */}
      {selectedProduto && (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes do Produto</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              {selectedProduto.imagem_url && (
                <Card className="p-4 flex justify-center">
                  <img src={selectedProduto.imagem_url} alt={selectedProduto.nome} className="h-40 object-cover rounded-lg shadow-md" />
                </Card>
              )}
              <p><strong>Código:</strong> {selectedProduto.codigo}</p>
              <p><strong>Nome:</strong> {selectedProduto.nome}</p>
              <p><strong>Fabricante:</strong> {selectedProduto.fabricante}</p>
              <p><strong>Preço:</strong> {selectedProduto.preco}</p>
              <p><strong>Tributos:</strong> {selectedProduto.tributos}</p>
              <p><strong>Classe do Material:</strong> {selectedProduto.classe_material}</p>
              <p><strong>Subclasse:</strong> {selectedProduto.sub_classe}</p>
              <p><strong>Classificação Fiscal:</strong> {selectedProduto.classificacao_fiscal}</p>
              <p><strong>Origem:</strong> {selectedProduto.origem}</p>
              <p><strong>Aplicação:</strong> {selectedProduto.aplicacao}</p>
              <p><strong>Estoque:</strong> {selectedProduto.estoque}</p>
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="destructive" onClick={() => handleDelete(selectedProduto.id)}>
                <Trash className="mr-2 h-4 w-4" /> Excluir
              </Button>
              <Button onClick={handleEdit}>
                <Pencil className="mr-2 h-4 w-4" /> Editar Produto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}