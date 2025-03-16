"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar } from "lucide-react";

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("visao-geral");

  const data = [
    { name: "Jan", value: 1200 },
    { name: "Fev", value: 6000 },
    { name: "Mar", value: 4000 },
    { name: "Abr", value: 3000 },
    { name: "Mai", value: 1200 },
    { name: "Jun", value: 4500 },
    { name: "Jul", value: 5800 },
    { name: "Ago", value: 3900 },
    { name: "Set", value: 5700 },
    { name: "Out", value: 5600 },
    { name: "Nov", value: 1300 },
    { name: "Dez", value: 4600 },
  ];

  return (
    <div className="">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Abas */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-4">
        <TabsList className="bg-gray-100 rounded-lg">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="analises" disabled>
            Análises
          </TabsTrigger>
          <TabsTrigger value="relatorios" disabled>
            Relatórios
          </TabsTrigger>
          <TabsTrigger value="notificacoes" disabled>
            Notificações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="mt-4">
          {/* Cards de Indicadores */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-sm text-gray-500">Receita Total</h2>
                <p className="text-2xl font-bold">R$ 45.231,89</p>
                <p className="text-xs text-green-500">+20.1% desde o mês passado</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-sm text-gray-500">Assinaturas</h2>
                <p className="text-2xl font-bold">+2.350</p>
                <p className="text-xs text-green-500">+180.1% desde o mês passado</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-sm text-gray-500">Vendas</h2>
                <p className="text-2xl font-bold">+12.234</p>
                <p className="text-xs text-green-500">+19% desde o mês passado</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-sm text-gray-500">Ativos Agora</h2>
                <p className="text-2xl font-bold">+573</p>
                <p className="text-xs text-green-500">+201 na última hora</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico e Vendas Recentes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="md:col-span-2">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold">Visão Geral</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="black" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold">Vendas Recentes</h2>
                <p className="text-sm text-gray-500">Você realizou 265 vendas este mês.</p>
                <ul className="mt-4 space-y-2">
                  <li className="flex justify-between">
                    <span className="text-sm font-medium">Olivia Martins</span>
                    <span className="text-sm font-bold text-green-500">+R$ 1.999,00</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm font-medium">Jackson Lima</span>
                    <span className="text-sm font-bold text-green-500">+R$ 39,00</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm font-medium">Isabella Nogueira</span>
                    <span className="text-sm font-bold text-green-500">+R$ 299,00</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm font-medium">William Souza</span>
                    <span className="text-sm font-bold text-green-500">+R$ 99,00</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm font-medium">Sofia Dias</span>
                    <span className="text-sm font-bold text-green-500">+R$ 39,00</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Barra de Data e Botão */}
      <div className="mt-6 flex justify-between items-center">
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          20 Jan, 2023 - 09 Fev, 2023
        </Button>
        <Button>Baixar</Button>
      </div>
    </div>
  );
}