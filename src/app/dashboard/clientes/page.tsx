"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

export default function ListarClientes() {
  const router = useRouter();
  
  // Simulação de dados de clientes (será substituído por dados do Supabase)
  const [clientes, setClientes] = useState([
    { id: 1, nome: "João Silva", tipo: "CPF", documento: "123.456.789-00", telefone: "(11) 98765-4321" },
    { id: 2, nome: "Empresa XYZ LTDA", tipo: "CNPJ", documento: "12.345.678/0001-99", telefone: "(11) 4002-8922" },
    { id: 3, nome: "Maria Souza", tipo: "CPF", documento: "987.654.321-00", telefone: "(21) 99876-5432" },
  ]);

  const [search, setSearch] = useState("");

  // Filtrar clientes com base na pesquisa
  const filteredClientes = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(search.toLowerCase().trim()) ||
    cliente.documento.replace(/\D/g, "").includes(search.replace(/\D/g, "")) ||
    cliente.telefone.replace(/\D/g, "").includes(search.replace(/\D/g, ""))
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button onClick={() => router.push("/dashboard/clientes/cadastrar")}>Adicionar Cliente</Button>
      </div>

      {/* Campo de Pesquisa */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Pesquisar por Nome, CPF ou Telefone..."
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
              <TableHead>Tipo</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{cliente.tipo}</TableCell>
                <TableCell>{cliente.documento}</TableCell>
                <TableCell>{cliente.telefone}</TableCell>
                <TableCell>
                  <Button variant="outline" size="icon" onClick={() => router.push(`/dashboard/clientes/${cliente.id}/editar`)}>
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