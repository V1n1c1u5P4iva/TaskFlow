"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { theme } from "@/styles/theme";
import { TrendingUp, Zap, Target, Sparkles, Loader2, RefreshCw, Brain } from "lucide-react";
import { useState, useEffect } from "react";
import { api, TaskStats } from "@/lib/api";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function InsightsPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTasks, setIsFetchingTasks] = useState(true);

  useEffect(() => {
    fetchTasksAndGenerateInsights();
  }, []);

  const fetchTasksAndGenerateInsights = async () => {
    setIsFetchingTasks(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      
      const [tasksData, statsData] = await Promise.all([
        api.getTasks(token),
        api.getTaskStats(token)
      ]);

      setTasks(tasksData);
      setStats(statsData);
      
      // Auto-generate insights if there are tasks
      if (tasksData.length > 0) {
        await generateInsights(tasksData, token);
      }
    } catch (err) {
      console.log("Erro ao carregar dados", err);
      setTasks([]);
    } finally {
      setIsFetchingTasks(false);
    }
  };

  const generateInsights = async (taskList: any[], token: string) => {
    setIsLoading(true);
    try {
      const tasksSummary = taskList.map(t => ({
        titulo: t.titulo,
        status: t.status,
        prioridade: t.prioridade,
        data_vencimento: t.data_vencimento
      }));

      const prompt = `Analise estas tarefas e gere 3 insights curtos e diretos sobre produtividade.
      Tarefas: ${JSON.stringify(tasksSummary)}
      Retorne JSON: { insights: [{ title: 'Título', description: 'Descrição', type: 'productivity'|'pattern'|'recommendation', priority: 'high'|'medium'|'low' }] }`;

      const response = await api.getInsightsWithAI(token, prompt);
      
      if (response.insights && response.insights.length > 0) {
        setInsights(response.insights);
      }
    } catch (err) {
      console.error("Erro ao gerar insights:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshInsights = async () => {
    if (tasks.length === 0) return;
    const token = localStorage.getItem("authToken");
    if (token) await generateInsights(tasks, token);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "productivity": return TrendingUp;
      case "pattern": return Zap;
      case "recommendation": return Target;
      default: return Brain;
    }
  };

  const getColorForPriority = (priority: string) => {
    switch (priority) {
      case "high": return "#EF4444";
      case "medium": return "#F59E0B";
      case "low": return "#22C55E";
      default: return theme.colors.primary;
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const preparePieData = () => {
    if (!stats) return [];
    return Object.entries(stats.by_status).map(([name, value]) => ({
      name: name === 'em_progresso' ? 'Em Andamento' : name === 'concluida' ? 'Concluída' : 'Pendente',
      value
    }));
  };

  const prepareBarData = () => {
    if (!stats) return [];
    return Object.entries(stats.by_priority).map(([name, value]) => ({
      name: name === 'alta' ? 'Alta' : name === 'media' ? 'Média' : 'Baixa',
      value
    }));
  };

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <PageHeader 
          title="Insights IA"
          subtitle="Análises inteligentes sobre sua produtividade"
          emoji="✨"
        />

        {/* Charts Section */}
        {stats && (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "24px", 
            marginBottom: "40px" 
          }}>
            <Card style={{ padding: "24px", height: "400px", minHeight: "400px" }}>
              <h3 style={{ marginBottom: "20px", fontWeight: 600 }}>Distribuição de Status</h3>
              <div style={{ width: "100%", height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={preparePieData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {preparePieData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card style={{ padding: "24px", height: "400px", minHeight: "400px" }}>
              <h3 style={{ marginBottom: "20px", fontWeight: 600 }}>Tarefas por Prioridade</h3>
              <div style={{ width: "100%", height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareBarData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill={theme.colors.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {/* Action Bar */}
        <Card style={{ padding: "20px", marginBottom: "30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--foreground)", margin: 0, marginBottom: "5px" }}>
                {tasks.length} tarefa(s) analisada(s)
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-light)", margin: 0 }}>
                A IA gerou insights baseados em suas tarefas reais
              </p>
            </div>
            <Button
              onClick={handleRefreshInsights}
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
                  Analisando...
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  Atualizar Insights
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Insights Grid */}
        {!isFetchingTasks && insights.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {insights.map((insight, index) => {
              const Icon = getIconForType(insight.type);
              const color = getColorForPriority(insight.priority);
              
              return (
                <Card key={index} style={{ padding: "24px", position: "relative", overflow: "hidden" }}>
                  {/* Priority Indicator */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "4px",
                    height: "100%",
                    background: color
                  }} />

                  <div style={{ 
                    width: "48px", 
                    height: "48px", 
                    borderRadius: "12px", 
                    background: `${color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px"
                  }}>
                    <Icon size={24} color={color} />
                  </div>
                  
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", marginBottom: "8px" }}>
                    {insight.title}
                  </h3>
                  
                  <p style={{ fontSize: "14px", color: "var(--text-light)", lineHeight: 1.6, margin: 0 }}>
                    {insight.description}
                  </p>

                  {/* Type Badge */}
                  <div style={{
                    marginTop: "16px",
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    background: `${color}15`,
                    color: color
                  }}>
                    {insight.type === "productivity" ? "📊 Produtividade" : 
                     insight.type === "pattern" ? "⚡ Padrão" : 
                     "🎯 Recomendação"}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
