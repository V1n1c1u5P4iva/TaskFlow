"use client";

import { theme } from "@/styles/theme";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TaskModal } from "@/components/ui/TaskModal";
import { Plus, CheckCircle2, Clock, AlertCircle, Edit2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      
      const data = await api.getTasks(token);
      setTasks(data);
    } catch (err) {
      console.log("Erro ao carregar tarefas", err);
      setTasks([]); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = () => {
    setModalMode("create");
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode("edit");
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      await api.deleteTask(token, taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      alert("Erro ao excluir tarefa");
    }
  };

  const handleSaveTask = async (taskData: any) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      if (modalMode === "create") {
        const newTask = await api.createTask(token, taskData);
        setTasks([...tasks, newTask]);
      } else {
        const updatedTask = await api.updateTask(token, selectedTask.id, taskData);
        setTasks(tasks.map((t) => (t.id === selectedTask.id ? updatedTask : t)));
      }

      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (err) {
      alert("Erro ao salvar tarefa");
    }
  };

  const toggleExpand = (taskId: number) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluida": return "#10B981";
      case "em_progresso": return "#F59E0B";
      case "pendente": return "#6B7280";
      default: return "#6B7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "concluida": return <CheckCircle2 size={20} />;
      case "em_progresso": return <Clock size={20} />;
      case "pendente": return <AlertCircle size={20} />;
      default: return <AlertCircle size={20} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "concluida": return "Concluída";
      case "em_progresso": return "Em Progresso";
      case "pendente": return "Pendente";
      default: return status;
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "#EF4444";
      case "media": return "#F59E0B";
      case "baixa": return "#10B981";
      default: return "#6B7280";
    }
  };

  return (
    <>
      <div style={{ padding: "30px" }}>
        {/* Cabeçalho */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
              Minhas Tarefas
            </h1>
            <p style={{ color: "var(--text-light)", marginTop: "5px" }}>
              Gerencie e acompanhe suas tarefas
            </p>
          </div>
          <Button
            onClick={handleCreateTask}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px",
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, #4338CA 100%)`,
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
              padding: "10px 24px",
              height: "45px",
              fontSize: "15px"
            }}
          >
            <Plus size={20} />
            Nova Tarefa
          </Button>
        </div>

        {/* Estatísticas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <Card style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ 
                width: "50px", 
                height: "50px", 
                borderRadius: "12px", 
                background: `${theme.colors.primary}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.colors.primary
              }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p style={{ fontSize: "14px", color: "var(--text-light)", margin: 0 }}>Total de Tarefas</p>
                <p style={{ fontSize: "28px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>{tasks.length}</p>
              </div>
            </div>
          </Card>

          <Card style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ 
                width: "50px", 
                height: "50px", 
                borderRadius: "12px", 
                background: "#10B98115",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10B981"
              }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p style={{ fontSize: "14px", color: "var(--text-light)", margin: 0 }}>Concluídas</p>
                <p style={{ fontSize: "28px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                  {tasks.filter(t => t.status === "concluida").length}
                </p>
              </div>
            </div>
          </Card>

          <Card style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ 
                width: "50px", 
                height: "50px", 
                borderRadius: "12px", 
                background: "#F59E0B15",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F59E0B"
              }}>
                <Clock size={24} />
              </div>
              <div>
                <p style={{ fontSize: "14px", color: "var(--text-light)", margin: 0 }}>Em Progresso</p>
                <p style={{ fontSize: "28px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                  {tasks.filter(t => t.status === "em_progresso").length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de Tarefas */}
        <Card style={{ padding: "0", overflow: "hidden" }}>
          <div style={{ padding: "20px", borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--foreground)", margin: 0 }}>
              Todas as Tarefas
            </h2>
          </div>
          
          <div>
            {isLoading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-light)" }}>
                Carregando tarefas...
              </div>
            ) : tasks.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-light)" }}>
                Nenhuma tarefa encontrada. Crie uma nova para começar!
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id}>
                  <div 
                    style={{
                      padding: "20px",
                      borderBottom: "1px solid var(--border)",
                      transition: "background 0.2s",
                      cursor: "pointer"
                    }}
                    onClick={() => toggleExpand(task.id)}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--background)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "15px", flex: 1 }}>
                        <div style={{ color: getStatusColor(task.status) }}>
                          {getStatusIcon(task.status)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--foreground)", margin: 0, marginBottom: "5px" }}>
                            {task.titulo}
                          </h3>
                          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <span 
                              style={{ 
                                fontSize: "12px", 
                                padding: "4px 10px", 
                                borderRadius: "6px",
                                background: `${getStatusColor(task.status)}15`,
                                color: getStatusColor(task.status),
                                fontWeight: 500
                              }}
                            >
                              {getStatusLabel(task.status)}
                            </span>
                            <span 
                              style={{ 
                                fontSize: "12px", 
                                padding: "4px 10px", 
                                borderRadius: "6px",
                                background: `${getPrioridadeColor(task.prioridade)}15`,
                                color: getPrioridadeColor(task.prioridade),
                                fontWeight: 500
                              }}
                            >
                              {task.prioridade.charAt(0).toUpperCase() + task.prioridade.slice(1)}
                            </span>
                            {task.data_vencimento && (
                              <span style={{ fontSize: "13px", color: "var(--text-light)" }}>
                                Vencimento: {new Date(task.data_vencimento).toLocaleDateString('pt-BR')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={(e) => handleEditTask(task, e)}
                          style={{
                            background: "var(--background)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            cursor: "pointer",
                            color: theme.colors.primary,
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "14px",
                          }}
                        >
                          <Edit2 size={16} />
                          Editar
                        </button>
                        <button
                          onClick={(e) => handleDeleteTask(task.id, e)}
                          style={{
                            background: "var(--background)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            cursor: "pointer",
                            color: "#EF4444",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "14px",
                          }}
                        >
                          <Trash2 size={16} />
                          Excluir
                        </button>
                      </div>
                    </div>

                    {expandedTaskId === task.id && task.descricao && (
                      <div style={{
                        marginTop: "15px",
                        padding: "15px",
                        background: "var(--background)",
                        borderRadius: "8px",
                        border: "1px solid var(--border)"
                      }}>
                        <p style={{ 
                          fontSize: "14px", 
                          color: "var(--foreground)", 
                          margin: 0,
                          lineHeight: "1.6"
                        }}>
                          {task.descricao}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={selectedTask}
        mode={modalMode}
      />
    </>
  );
}
