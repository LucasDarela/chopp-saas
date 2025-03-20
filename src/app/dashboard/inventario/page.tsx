"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Trash, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import router from "next/router";

// Definição dos tipos
interface Cliente {
  id: string;
  name: string;
  phone: string;
  document: string;
  city: string;
}

interface Comodato {
  id: string;
  cliente_id: string;
  produto: string;
  data_emissao: string;
  numero_nota: string;
}

export default function Inventario() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [comodatos, setComodatos] = useState<Comodato[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [comodatosCliente, setComodatosCliente] = useState<Comodato[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchClientes = async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, name, phone, document, city");

      if (error) {
        toast.error("Erro ao buscar clientes.");
        console.error("Erro ao buscar clientes:", error.message);
      } else {
        setClientes(data || []);
      }
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    const fetchComodatos = async () => {
      const { data, error } = await supabase
        .from("comodatos")
        .select("id, cliente_id, produto, data_emissao, numero_nota");

      if (error) {
        toast.error("Erro ao buscar comodatos.");
        console.error("Erro ao buscar comodatos:", error.message);
      } else {
        setComodatos(data || []);
      }
    };

    fetchComodatos();
  }, []);

  // Abrir modal do cliente com seus comodatos
  const openModal = (cliente: Cliente) => {
    const comodatosFiltrados = comodatos.filter((c) => c.cliente_id === cliente.id);
    setSelectedCliente(cliente);
    setComodatosCliente(comodatosFiltrados);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCliente(null);
    setComodatosCliente([]);
    setIsModalOpen(false);
  };

  // Filtrar clientes conforme a pesquisa
  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.name.toLowerCase().includes(search.toLowerCase()) ||
      cliente.document.includes(search)
  );

  return (
    <div>
      {/* 🔹 Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Inventário de Comodatos</h1>
        <Button onClick={() => router.push("/dashboard/inventario/cadastrar")} className="w-full sm:w-auto">
          Cadastrar Comodato
        </Button>
      </div>

      {/* 🔹 Campo de Pesquisa */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Pesquise por nome ou documento..."
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
              <TableHead className="hidden md:table-cell">Documento</TableHead>
              <TableHead className="hidden md:table-cell">Telefone</TableHead>
              <TableHead className="hidden md:table-cell">Cidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClientes.length > 0 ? (
              filteredClientes.map((cliente) => (
                <TableRow
                  key={cliente.id}
                  onClick={() => openModal(cliente)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <TableCell>{cliente.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{cliente.document}</TableCell>
                  <TableCell className="hidden md:table-cell">{cliente.phone}</TableCell>
                  <TableCell className="hidden md:table-cell">{cliente.city}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 🔹 Modal de Detalhes do Cliente e Comodatos */}
      {isModalOpen && selectedCliente && (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent className="max-w-lg w-full">
            <DialogHeader>
              <DialogTitle>Comodatos de {selectedCliente.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p><strong>Documento:</strong> {selectedCliente.document}</p>
              <p><strong>Telefone:</strong> {selectedCliente.phone}</p>
              <p><strong>Cidade:</strong> {selectedCliente.city}</p>
            </div>
            <h3 className="font-bold mt-4">Produtos Comodatados:</h3>
            {comodatosCliente.length > 0 ? (
              <Table className="mt-2">
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Data de Emissão</TableHead>
                    <TableHead>Nº Nota</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comodatosCliente.map((comodato) => (
                    <TableRow key={comodato.id}>
                      <TableCell>{comodato.produto}</TableCell>
                      <TableCell>{new Date(comodato.data_emissao).toLocaleDateString()}</TableCell>
                      <TableCell>{comodato.numero_nota}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500">Nenhum produto comodatado encontrado.</p>
            )}
            <DialogFooter className="flex justify-between">
              <Button variant="default" onClick={() => router.push(`/dashboard/inventario/historico/${selectedCliente.id}`)}>
                <Eye className="mr-2 h-4 w-4" /> Histórico de Comodato
              </Button>
              <Button variant="destructive" onClick={closeModal}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}