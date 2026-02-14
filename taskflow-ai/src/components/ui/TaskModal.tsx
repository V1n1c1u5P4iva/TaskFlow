import { theme } from "@/styles/theme";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "./Input";
import { Button } from "./Button";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
  onDelete?: (task: any) => void;
  task?: any;
  mode: "create" | "edit";
}

export function TaskModal({ isOpen, onClose, onSave, onDelete, task, mode }: TaskModalProps) {
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    status: "pendente",
    prioridade: "media",
    data_vencimento: "",
  });

  useEffect(() => {
    if (task && mode === "edit") {
      setFormData({
        titulo: task.titulo || "",
        descricao: task.descricao || "",
        status: task.status || "pendente",
        prioridade: task.prioridade || "media",
        data_vencimento: task.data_vencimento ? task.data_vencimento.split('T')[0] : "",
      });
    } else {
      setFormData({
        titulo: "",
        descricao: "",
        status: "pendente",
        prioridade: "media",
        data_vencimento: "",
      });
    }
  }, [task, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDelete = () => {
    if (onDelete && task) {
      if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
        onDelete(task);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--card-bg)",
          borderRadius: "16px",
          padding: "30px",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          border: "1px solid var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
            {mode === "create" ? "Nova Tarefa" : "Editar Tarefa"}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-light)",
              padding: "5px",
              display: "flex",
              alignItems: "center",
              borderRadius: "8px",
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Título"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Ex: Estudar React"
            required
          />

          <div style={{ marginBottom: "15px" }}>
            <label style={{
              fontSize: "14px",
              marginBottom: "5px",
              display: "block",
              color: "var(--foreground)",
              fontWeight: 500
            }}>
              Descrição
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva a tarefa..."
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                background: "var(--card-bg)",
                fontSize: "15px",
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
            <div>
              <label style={{
                fontSize: "14px",
                marginBottom: "5px",
                display: "block",
                color: "var(--foreground)",
                fontWeight: 500
              }}>
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{
                  width: "100%",
                  height: "45px",
                  padding: "0 12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  background: "var(--card-bg)",
                  fontSize: "15px",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="pendente">Pendente</option>
                <option value="em_progresso">Em Progresso</option>
                <option value="concluida">Concluída</option>
              </select>
            </div>

            <div>
              <label style={{
                fontSize: "14px",
                marginBottom: "5px",
                display: "block",
                color: "var(--foreground)",
                fontWeight: 500
              }}>
                Prioridade
              </label>
              <select
                name="prioridade"
                value={formData.prioridade}
                onChange={handleChange}
                style={{
                  width: "100%",
                  height: "45px",
                  padding: "0 12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  background: "var(--card-bg)",
                  fontSize: "15px",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>

          <Input
            label="Data de Vencimento"
            type="date"
            name="data_vencimento"
            value={formData.data_vencimento}
            onChange={handleChange}
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "25px" }}>
            <Button type="submit" style={{ flex: 1 }}>
              {mode === "create" ? "Criar Tarefa" : "Salvar Alterações"}
            </Button>
            
            {mode === "edit" && onDelete && (
              <Button 
                type="button" 
                onClick={handleDelete}
                style={{ 
                  flex: 0.5, 
                  background: "#EF4444", 
                  color: "white", 
                  border: "none" 
                }}
              >
                Excluir
              </Button>
            )}

            <Button
              type="button"
              onClick={onClose}
              style={{
                flex: 0.5,
                background: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
