"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// 🔹 Definição dos tipos de dados
interface ContaBancaria {
  id: string;
  banco: string;
  agencia: string;
  conta: string;
}

interface Fornecedor {
  id: string;
  name: string;
}

export default function ContasAPagar() {
  const [contasBancarias, setContasBancarias] = useState<ContaBancaria[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [novaConta, setNovaConta] = useState({ banco: "", agencia: "", conta: "" });

  const [contaSelecionada, setContaSelecionada] = useState<string>("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>("");
  const [categoriaPersonalizada, setCategoriaPersonalizada] = useState<string>("");
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<string>("");
  const [formaPagamento, setFormaPagamento] = useState<string>("dinheiro");
  const [diasPagamento, setDiasPagamento] = useState<number | "">("");
  const [valor, setValor] = useState<number | "">("");
  const [descricao, setDescricao] = useState<string>("");
  const [recorrencia, setRecorrencia] = useState<boolean>(false);
  const [observacoes, setObservacoes] = useState<string>("");
  const [modalAberto, setModalAberto] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      const { data: contas, error: errorContas } = await supabase.from("contas_bancarias").select("id, banco, agencia, conta");
      const { data: fornecedores, error: errorFornecedores } = await supabase.from("fornecedores").select("id, name");

      if (errorContas) toast.error("Erro ao buscar contas bancárias.");
      else setContasBancarias(Array.isArray(contas) ? contas : []);

      if (errorFornecedores) toast.error("Erro ao buscar fornecedores.");
      else setFornecedores(Array.isArray(fornecedores) ? fornecedores : []);
    }

    fetchData();
  }, []);

  const adicionarContaBancaria = async () => {
    if (!novaConta.banco || !novaConta.agencia || !novaConta.conta) {
      toast.error("Preencha todos os campos da conta bancária.");
      return;
    }

    const { error } = await supabase.from("contas_bancarias").insert([novaConta]);
    if (error) {
      toast.error("Erro ao cadastrar conta bancária.");
    } else {
      toast.success("Conta bancária cadastrada com sucesso!");
      setModalAberto(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Registrar Conta a Pagar</h1>
      
      {/* Conta Bancária */}
      <Select value={contaSelecionada} onValueChange={setContaSelecionada}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione a conta bancária" />
        </SelectTrigger>
        <SelectContent>
          {contasBancarias.map((conta) => (
            <SelectItem key={conta.id} value={conta.id}>{conta.banco} - {conta.agencia}/{conta.conta}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={() => setModalAberto(true)} className="mt-2">Adicionar Conta</Button>
      
      {/* Categoria */}
      <Select value={categoriaSelecionada} onValueChange={setCategoriaSelecionada}>
        <SelectTrigger className="w-full mt-4">
          <SelectValue placeholder="Selecione uma categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="compra_produto">Compra de Produto</SelectItem>
          <SelectItem value="pagamento_funcionario">Pagamento Funcionário</SelectItem>
          <SelectItem value="vale_funcionario">Vale Funcionário</SelectItem>
          <SelectItem value="agua">Água</SelectItem>
          <SelectItem value="luz">Luz</SelectItem>
          <SelectItem value="aluguel">Aluguel</SelectItem>
          <SelectItem value="veiculo">Despesas Veículos</SelectItem>
          <SelectItem value="outros">Outros</SelectItem>
        </SelectContent>
      </Select>
      {categoriaSelecionada === "outros" && <Input placeholder="Informe a categoria personalizada" value={categoriaPersonalizada} onChange={(e) => setCategoriaPersonalizada(e.target.value)} className="mt-2" />}
      
      <Input placeholder="Descrição (Opcional)" value={descricao} onChange={(e) => setDescricao(e.target.value)} className="mt-4" />
      <Input type="number" placeholder="Valor" value={valor} onChange={(e) => setValor(Number(e.target.value) || "")} className="mt-4" />
      
      {/* Fornecedor */}
      <Select value={fornecedorSelecionado} onValueChange={setFornecedorSelecionado}>
        <SelectTrigger className="w-full mt-4">
          <SelectValue placeholder="Selecione um fornecedor" />
        </SelectTrigger>
        <SelectContent>
          {fornecedores.map((fornecedor) => (
            <SelectItem key={fornecedor.id} value={fornecedor.id}>{fornecedor.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Forma de Pagamento */}
      <Select value={formaPagamento} onValueChange={setFormaPagamento}>
        <SelectTrigger className="w-full mt-4">
          <SelectValue placeholder="Forma de Pagamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dinheiro">Dinheiro</SelectItem>
          <SelectItem value="pix">Pix</SelectItem>
          <SelectItem value="cartao">Cartão</SelectItem>
          <SelectItem value="boleto">Boleto</SelectItem>
        </SelectContent>
      </Select>
      {formaPagamento === "boleto" && <Input type="number" placeholder="Dias para pagamento" value={diasPagamento} onChange={(e) => setDiasPagamento(Number(e.target.value) || "")} className="mt-2" />}
      
      <Input type="checkbox" checked={recorrencia} onChange={() => setRecorrencia(!recorrencia)} className="mt-4" /> <span>Pagamento recorrente</span>
      <Input placeholder="Observações" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className="mt-4" />
      
      <Button className="mt-4 w-full">Registrar Pagamento</Button>
      
      {/* Modal de Conta Bancária */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Conta Bancária</DialogTitle>
          </DialogHeader>
          <Input placeholder="Banco" value={novaConta.banco} onChange={(e) => setNovaConta({ ...novaConta, banco: e.target.value })} />
          <Input placeholder="Agência" value={novaConta.agencia} onChange={(e) => setNovaConta({ ...novaConta, agencia: e.target.value })} />
          <Input placeholder="Conta Corrente" value={novaConta.conta} onChange={(e) => setNovaConta({ ...novaConta, conta: e.target.value })} />
          <DialogFooter>
            <Button onClick={adicionarContaBancaria}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}