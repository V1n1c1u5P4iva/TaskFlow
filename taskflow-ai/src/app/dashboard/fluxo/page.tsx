"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { theme } from "@/styles/theme";
import { CheckCircle2, Circle, Lock, ArrowDown, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function FluxoIAPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [mindMapData, setMindMapData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTasks, setIsFetchingTasks] = useState(true);
  const [aiRecommendation, setAiRecommendation] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsFetchingTasks(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      
      const data = await api.getTasks(token);
      setTasks(data);
      
      // Auto-organize if there are tasks
      if (data.length > 0) {
        await organizeTasksWithAI(data, token);
      }
    } catch (err) {
      console.log("Erro ao carregar tarefas", err);
      setTasks([]);
    } finally {
      setIsFetchingTasks(false);
    }
  };

  const organizeTasksWithAI = async (taskList: any[], token: string) => {
    setIsLoading(true);
    try {
      // Criar um resumo das tarefas para a IA
      const tasksSummary = taskList.map(t => ({
        id: t.id,
        titulo: t.titulo,
        descricao: t.descricao || "Sem descrição",
        status: t.status,
        prioridade: t.prioridade,
        data_vencimento: t.data_vencimento
      }));

      const prompt = `Analise as seguintes tarefas e crie uma ordem de execução inteligente baseada em prioridade, dependências lógicas e prazos.

Tarefas:
${JSON.stringify(tasksSummary, null, 2)}

Retorne APENAS um JSON com a seguinte estrutura:
{
  "steps": [
    {
      "id": 1,
      "taskId": <id da tarefa original>,
      "title": "Título da tarefa",
      "description": "Descrição detalhada",
      "estimatedTime": "2 horas",
      "dependencies": [],
      "status": "current" (para a primeira) ou "locked" (para as outras)
    }
  ],
  "recommendation": "Uma recomendação geral sobre por onde começar e porquê"
}

IMPORTANTE: A primeira tarefa deve ter status "current" e as outras "locked". Ordene por prioridade e lógica de execução.`;

      const response = await api.generateFlowWithAI(token, prompt);
      
      if (response.steps) {
        setMindMapData(response.steps);
        setAiRecommendation(response.recommendation || "Siga a ordem sugerida pela IA para máxima produtividade");
      }
    } catch (err) {
      console.error("Erro ao organizar tarefas:", err);
      setAiRecommendation("Erro ao processar com IA. Verifique se o backend está configurado.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorganize = async () => {
    if (tasks.length === 0) {
      alert("Nenhuma tarefa disponível para organizar!");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Você precisa estar logado!");
      return;
    }

    await organizeTasksWithAI(tasks, token);
  };

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <PageHeader 
          title="Organizador Inteligente"
          subtitle="A IA analisa suas tarefas e cria a melhor sequência de execução"
          emoji="🧠"
        />

        {/* Action Button */}
        <Card style={{ padding: "25px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--foreground)", margin: 0, marginBottom: "5px" }}>
                {tasks.length} tarefa(s) encontrada(s)
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-light)", margin: 0 }}>
                A IA organizou suas tarefas automaticamente
              </p>
            </div>
            <Button
              onClick={handleReorganize}
              disabled={isLoading || isFetchingTasks}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                minWidth: "180px"
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Reorganizando...
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  Reorganizar
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* AI Recommendation Banner */}
        {aiRecommendation && (
          <Card style={{ 
            padding: "20px 24px", 
            marginBottom: "40px",
            background: `linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.primary}05 100%)`,
            border: `1px solid ${theme.colors.primary}30`,
            color: "var(--foreground)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Sparkles size={20} color={theme.colors.primary} />
              <p style={{ margin: 0, fontSize: "14px", color: "var(--foreground)" }}>
                <strong>Recomendação da IA:</strong> {aiRecommendation}
              </p>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {isFetchingTasks && (
          <Card style={{ padding: "40px", textAlign: "center" }}>
            <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto", color: theme.colors.primary }} />
            <p style={{ marginTop: "15px", color: "var(--text-light)" }}>Carregando suas tarefas...</p>
          </Card>
        )}

        {/* Empty State */}
        {!isFetchingTasks && tasks.length === 0 && (
          <Card style={{ padding: "40px", textAlign: "center" }}>
            <p style={{ fontSize: "16px", color: "var(--text-light)", margin: 0 }}>
              Nenhuma tarefa encontrada. Crie tarefas primeiro para que a IA possa organizá-las!
            </p>
          </Card>
        )}

        {/* Vertical Tree Mind Map */}
        {!isFetchingTasks && mindMapData.length > 0 && (
          <Card style={{ padding: "40px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--foreground)", marginBottom: "40px" }}>
            Ordem de Execução Sugerida
          </h3>

          {/* Vertical Flow */}
          <div style={{ position: "relative" }}>
            {/* Vertical connecting line */}
            <div style={{ 
              position: "absolute", 
              left: "50%", 
              top: "60px", 
              bottom: "60px", 
              width: "3px", 
              background: "#E5E7EB",
              transform: "translateX(-50%)",
              zIndex: 0
            }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "40px", position: "relative", zIndex: 1 }}>
              {mindMapData.map((task, index) => {
                const isDone = task.status === "done";
                const isCurrent = task.status === "current";
                const isLocked = task.status === "locked";
                const isLast = index === mindMapData.length - 1;

                return (
                  <div key={task.id}>
                    {/* Task Node */}
                    <div style={{ 
                      background: isCurrent ? "var(--card-bg)" : "var(--background)",
                      border: `2px solid ${isDone ? "#22C55E" : isCurrent ? theme.colors.primary : "var(--border)"}`,
                      borderRadius: "16px",
                      padding: "24px",
                      boxShadow: isCurrent ? "0 8px 24px rgba(0, 0, 0, 0.12)" : "0 2px 8px rgba(0, 0, 0, 0.04)",
                      position: "relative",
                      transition: "all 0.3s ease"
                    }}>
                      {/* Status Badge */}
                      <div style={{ 
                        position: "absolute",
                        top: "-12px",
                        left: "24px",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 700,
                        background: isDone ? "#DCFCE7" : isCurrent ? "#DBEAFE" : "var(--background)",
                        color: isDone ? "#15803D" : isCurrent ? "#1D4ED8" : "var(--text-light)",
                        border: `1px solid ${isDone ? "#22C55E" : isCurrent ? "#3B82F6" : "var(--border)"}`
                      }}>
                        {isDone ? "✓ Concluída" : isCurrent ? "▶ Comece por aqui" : "🔒 Bloqueada"}
                      </div>

                      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                        {/* Icon */}
                        <div style={{ 
                          width: "56px", 
                          height: "56px", 
                          borderRadius: "50%", 
                          background: isDone ? "#DCFCE7" : isCurrent ? "#DBEAFE" : "var(--background)",
                          border: `3px solid ${isDone ? "#22C55E" : isCurrent ? "#3B82F6" : "var(--border)"}`,
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          color: isDone ? "#15803D" : isCurrent ? "#1D4ED8" : "var(--text-light)",
                          flexShrink: 0
                        }}>
                          {isDone ? <CheckCircle2 size={28} /> : isLocked ? <Lock size={24} /> : <Circle size={24} />}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1 }}>
                          <h4 style={{ 
                            fontSize: "18px", 
                            fontWeight: 700, 
                            color: "var(--foreground)", 
                            marginBottom: "8px",
                            lineHeight: 1.3
                          }}>
                            {task.title}
                          </h4>
                          
                          <p style={{ 
                            fontSize: "14px", 
                            color: "var(--text-light)", 
                            marginBottom: "16px",
                            lineHeight: 1.6
                          }}>
                            {task.description}
                          </p>

                          {/* Meta Info */}
                          <div style={{ 
                            display: "flex", 
                            gap: "20px",
                            fontSize: "13px",
                            color: "var(--text-light)",
                            paddingTop: "12px",
                            borderTop: `1px solid var(--border)`
                          }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              ⏱ <strong>{task.estimatedTime}</strong>
                            </span>
                            {task.dependencies && task.dependencies.length > 0 && (
                              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                🔗 Depende de <strong>#{task.dependencies.join(", #")}</strong>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connecting Arrow */}
                    {!isLast && (
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "center",
                        padding: "20px 0",
                        color: isDone ? "#22C55E" : "var(--border)"
                      }}>
                        <ArrowDown size={32} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          </Card>
        )}

      </div>
    </div>
  );
}
