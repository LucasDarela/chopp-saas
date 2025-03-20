"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { format, parseISO, isBefore, isToday } from "date-fns";
import { Clock } from "lucide-react";

// 🔹 Tipo Agendamento
interface Agendamento {
  id: number;
  data: string;
  horario: string;
  localEntrega: string;
  cliente: string;
  numeroNota: string;
  status: string;
}

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [search, setSearch] = useState<string>("");

  // 🔹 Buscar agendamentos a partir das vendas no Supabase
  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const { data, error } = await supabase
          .from("vendas")
          .select("id, numero_nota, cliente, agendamento, status")
          .neq("agendamento->>data", null) // 🔹 Buscar apenas vendas que possuem data de agendamento
          .order("agendamento->>data", { ascending: true });

        if (error) {
          console.error("❌ Erro ao buscar agendamentos:", error.message);
          toast.error("Erro ao carregar agendamentos.");
          return;
        }

        const agendamentosFormatados = data.map((venda) => ({
          id: venda.id,
          numeroNota: venda.numero_nota || "N/A",
          cliente: venda.cliente,
          data: venda.agendamento?.data || "", // 🔹 Certifique-se que a data existe
          horario: venda.agendamento?.horario || "Sem horário",
          localEntrega: venda.agendamento?.localEntrega || "Não informado",
          status: venda.status || "Pendente",
        }));

        setAgendamentos(agendamentosFormatados);
      } catch (error) {
        console.error("❌ Erro ao processar agendamentos:", error);
        toast.error("Erro ao processar os dados de agendamentos.");
      }
    };

    fetchAgendamentos();
  }, []);

  // 🔹 Agrupar agendamentos por data
  const agendamentosAgrupados = agendamentos.reduce((acc, agendamento) => {
    const dataFormatada = agendamento.data ? format(parseISO(agendamento.data), "dd/MM/yyyy") : "Data Inválida";
    if (!acc[dataFormatada]) acc[dataFormatada] = [];
    acc[dataFormatada].push(agendamento);
    return acc;
  }, {} as Record<string, Agendamento[]>);

  // 🔹 Filtragem pelo campo de pesquisa
  const agendamentosFiltrados = Object.entries(agendamentosAgrupados).reduce((acc, [data, agendamentosDoDia]) => {
    const filtrados = agendamentosDoDia.filter(
      (a) =>
        a.cliente.toLowerCase().includes(search.toLowerCase()) ||
        a.numeroNota.toLowerCase().includes(search.toLowerCase()) ||
        a.localEntrega.toLowerCase().includes(search.toLowerCase())
    );
    if (filtrados.length > 0) {
      acc[data] = filtrados;
    }
    return acc;
  }, {} as Record<string, Agendamento[]>);

  return (
    <div>
      {/* 🔹 Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Agendamentos</h1>
      </div>

      {/* 🔹 Campo de Pesquisa */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Pesquisar por cliente, nota ou local de entrega..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* 🔹 Tabela de Agendamentos */}
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto max-w-full">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Número da Nota</TableHead>
              <TableHead>Local de Entrega</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(agendamentosFiltrados).length > 0 ? (
              Object.entries(agendamentosFiltrados).map(([data, agendamentosDoDia]) => (
                <React.Fragment key={data}>
                  <TableRow className="bg-gray-100">
                    <TableCell colSpan={6} className="text-center font-bold py-3">
                      📅 {data}
                    </TableCell>
                  </TableRow>
                  {agendamentosDoDia.map((agendamento) => (
                    <TableRow key={agendamento.id} className="h-16">
                      <TableCell
                        className={
                          isToday(parseISO(agendamento.data))
                            ? "text-blue-600 font-bold"
                            : isBefore(parseISO(agendamento.data), new Date())
                            ? "text-red-600"
                            : ""
                        }
                      >
                        {format(parseISO(agendamento.data), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        <Clock className="inline-block w-4 h-4 mr-1" />
                        {agendamento.horario}
                      </TableCell>
                      <TableCell>{agendamento.cliente}</TableCell>
                      <TableCell>{agendamento.numeroNota}</TableCell>
                      <TableCell>{agendamento.localEntrega}</TableCell>
                      <TableCell
                        className={
                          agendamento.status === "Concluído"
                            ? "text-green-600 font-bold"
                            : agendamento.status === "Cancelado"
                            ? "text-red-600"
                            : ""
                        }
                      >
                        {agendamento.status}
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Nenhum agendamento encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}