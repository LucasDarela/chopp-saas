"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

export default function ListarProdutos() {
  const router = useRouter();
  
  // Simulação de dados de produtos (será substituído por dados do Supabase)
  const [produtos, setProdutos] = useState([
    { id: 1, nome: "Chopp Heineken", categoria: "Chopp", preco: "R$ 15,00", estoque: 50 },
    { id: 2, nome: "Chopp Amstel", categoria: "Chopp", preco: "R$ 12,00", estoque: 30 },
    { id: 3, nome: "Chopp Brahma", categoria: "Chopp", preco: "R$ 14,00", estoque: 40 },
  ]);

  const [search, setSearch] = useState("");

  // Filtrar produtos com base na pesquisa
  const filteredProdutos = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Button onClick={() => router.push("/dashboard/produtos/cadastrar")}>Adicionar Produto</Button>
      </div>

      {/* Campo de Pesquisa */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Pesquisar por Nome do Produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProdutos.map((produto) => (
              <TableRow key={produto.id}>
                <TableCell>{produto.nome}</TableCell>
                <TableCell>{produto.categoria}</TableCell>
                <TableCell>{produto.preco}</TableCell>
                <TableCell>{produto.estoque}</TableCell>
                <TableCell>
                  <Button variant="outline" size="icon" onClick={() => router.push(`/dashboard/produtos/${produto.id}/editar`)}>
                    <Pencil size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}