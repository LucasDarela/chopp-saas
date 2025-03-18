"use client";

import { useState } from "react";
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// 🔹 Configurar localizador de datas
const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function Agendamentos() {
  const [eventos, setEventos] = useState<Event[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [novoEvento, setNovoEvento] = useState({ title: "", start: new Date(), end: new Date() });

  // 🔹 Abrir modal para adicionar evento
  const abrirModal = (slotInfo: { start: Date; end: Date }) => {
    setNovoEvento({ title: "", start: slotInfo.start, end: slotInfo.end });
    setModalAberto(true);
  };

  // 🔹 Adicionar evento
  const adicionarEvento = () => {
    if (!novoEvento.title.trim()) {
      toast.error("O evento precisa de um título!");
      return;
    }
    setEventos([...eventos, novoEvento]);
    setModalAberto(false);
    toast.success("Evento adicionado!");
  };

  // 🔹 Remover evento ao clicar
  const removerEvento = (eventoSelecionado: Event) => {
    if (confirm("Deseja remover este evento?")) {
      setEventos(eventos.filter((evento) => evento !== eventoSelecionado));
      toast.success("Evento removido!");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Agendamentos</h1>

      {/* 🔹 Calendário */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <Calendar
          localizer={localizer}
          events={eventos}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          selectable
          onSelectSlot={abrirModal}
          onSelectEvent={removerEvento}
        />
      </div>

      {/* 🔹 Modal de Novo Evento */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Evento</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Título do Evento"
            value={novoEvento.title}
            onChange={(e) => setNovoEvento({ ...novoEvento, title: e.target.value })}
          />
          <DialogFooter>
            <Button variant="destructive" onClick={() => setModalAberto(false)}>Cancelar</Button>
            <Button onClick={adicionarEvento}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}