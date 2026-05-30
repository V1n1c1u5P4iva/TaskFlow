"use client";

import { theme } from "@/styles/theme";
import { Button } from "@/components/ui/Button";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { AIPriorityCard } from "@/components/dashboard/AIPriorityCard";
import { TaskModal } from "@/components/ui/TaskModal";
import { PageHeader } from "@/components/ui/PageHeader";
import { Plus, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [aiInsight, setAiInsight] = useState<any>(null);
  const { addToast } = useToast();
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Usuário");

  useEffect(() => {
    const user = auth.getUser();
    if (user?.nome) setUserName(user.nome.split(" ")[0]);
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      console.log("Dashboard: Fetching data, token present:", !!token);
      
      if (!token) {
        console.log("Dashboard: No token found");
        setIsLoading(false);
        return;
      }
      
      // Fetch Tasks
      let tasksData: any[] = [];
      try {
        console.log("Dashboard: Calling api.getTasks");
        tasksData = await api.getTasks(token);
        console.log("Dashboard: Tasks fetched:", tasksData.length);
        // Filter out completed tasks and limit to 5
        const pendingTasks = tasksData.filter(t => t.status !== "concluida");
        setTasks(pendingTasks.slice(0, 5));
      } catch (err) {
        console.error("Dashboard: Error fetching tasks", err);
        setTasks([]);
      }

      // Fetch AI Insights
      try {
        console.log("Dashboard: Calling api.getInsightsWithAI");
        const tasksSummary = tasksData.map(t => ({
          titulo: t.titulo,
          status: t.status,
          prioridade: t.prioridade,
          data_vencimento: t.data_vencimento
        }));

        const prompt = `Analise as seguintes tarefas e sugira UMA tarefa específica para o usuário fazer agora.
        Tarefas: ${JSON.stringify(tasksSummary)}
        
        Retorne APENAS um JSON com a seguinte estrutura:
        {
          "insights": [
            {
              "title": "Nome exato da tarefa sugerida",
              "reason": "Motivo curto e direto (ex: Prazo próximo, alta prioridade)",
              "impact": "Impacto imediato (ex: Libera outras tarefas)",
              "message": "Uma frase curta de incentivo"
            }
          ]
        }
        
        Se não houver tarefas, sugira criar uma nova.`;

        const insightsData = await api.getInsightsWithAI(token, prompt);
        console.log("Dashboard: AI Insights fetched", insightsData);
        if (insightsData && insightsData.insights && insightsData.insights.length > 0) {
          setAiInsight(insightsData.insights[0]);
        }
      } catch (err) {
        console.error("Dashboard: Error fetching AI", err);
      }

    } catch (err) {
      console.error("Dashboard: General error", err);
    } finally {
      console.log("Dashboard: Finished loading");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTask = () => {
    setSelectedTask(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: any) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      if (modalMode === "create") {
        await api.createTask(token, taskData);
        addToast("Tarefa criada com sucesso!", "success");
      } else if (modalMode === "edit" && selectedTask) {
        await api.updateTask(token, selectedTask.id, taskData);
        addToast("Tarefa atualizada com sucesso!", "success");
      }
      
      // Refresh tasks and AI
      fetchData();
      
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      addToast("Erro ao salvar tarefa. Verifique se o backend está rodando.", "error");
    }
  };

  const handleDeleteTask = async (task: any) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      await api.deleteTask(token, task.id);
      addToast("Tarefa excluída com sucesso!", "success");
      
      // Refresh tasks and AI
      fetchData();
      
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      addToast("Erro ao excluir tarefa", "error");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <PageHeader 
          title={`Olá, ${userName}`}
          subtitle="Aqui estão suas tarefas de hoje"
          emoji="👋"
        />

        {/* AI Suggestion Section */}
        <div style={{ marginBottom: "40px" }}>
          {aiInsight ? (
            <AIPriorityCard 
              taskTitle={aiInsight.title || "Sugestão Inteligente"}
              reason={aiInsight.reason || aiInsight.message}
              impact={aiInsight.impact || "Melhora sua produtividade"}
              onStart={() => {}}
            />
          ) : (
            <AIPriorityCard 
              taskTitle="Analisando suas tarefas..."
              reason="A IA está processando seus dados para gerar insights."
              impact="Aguarde um momento."
              onStart={() => {}}
            />
          )}
        </div>

        {/* Action Section */}
        <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button 
            onClick={handleCreateTask}
            style={{ width: "fit-content", padding: "0 24px", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Plus size={20} />
            Adicionar Tarefa
          </Button>

          <Button 
            onClick={() => router.push("/dashboard/tasks")}
            style={{ 
              width: "fit-content", 
              padding: "0 24px", 
              display: "flex", 
              alignItems: "center", 
              gap: "8px",
              background: "transparent",
              color: theme.colors.primary,
              border: `1px solid ${theme.colors.primary}`
            }}
          >
            Ver todas
            <ArrowRight size={18} />
          </Button>
        </div>

        {/* Tasks Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
          gap: "24px"
        }}>
          {isLoading ? (
            <p style={{ color: "var(--text-light)" }}>Carregando tarefas...</p>
          ) : tasks.length === 0 ? (
            <p style={{ color: "var(--text-light)" }}>Nenhuma tarefa pendente.</p>
          ) : (
            tasks.map((task, index) => (
              <TaskCard 
                key={index} 
                title={task.titulo}
                description={task.descricao || "Sem descrição"}
                status={task.status === "em_progresso" ? "Em andamento" : task.status === "concluida" ? "Concluída" : "Pendente"}
                onClick={() => handleTaskClick(task)}
              />
            ))
          )}
        </div>

        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          task={selectedTask}
          mode={modalMode}
        />

      </div>
    </div>
  );
}
