"use client";

import { theme } from "@/styles/theme";
import { Card } from "@/components/ui/Card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { TaskModal } from "@/components/ui/TaskModal";
import { useToast } from "@/components/ui/Toast";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const { addToast } = useToast();
  
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      
      try {
        const data = await api.getTasks(token);
        setTasks(data);
      } catch (err) {
        console.log("Backend offline");
        setTasks([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: any) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      if (selectedTask) {
        await api.updateTask(token, selectedTask.id, taskData);
        addToast("Tarefa atualizada com sucesso!", "success");
        fetchTasks();
      }
      
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      addToast("Erro ao atualizar tarefa", "error");
    }
  };

  const handleDeleteTask = async (task: any) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      await api.deleteTask(token, task.id);
      addToast("Tarefa excluída com sucesso!", "success");
      fetchTasks();
      
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      addToast("Erro ao excluir tarefa", "error");
    }
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Dias do mês anterior
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: "", isCurrentMonth: false });
    }
    
    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    
    return days;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDayClick = (day: number) => {
    if (day) {
      setSelectedDay(day);
    }
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const isSelectedDay = (day: number) => {
    return day === selectedDay;
  };

  const days = getDaysInMonth(currentDate);

  // Processar tarefas para o calendário
  const tasksOnDays: Record<number, number> = {};
  tasks.forEach(task => {
    if (task.data_vencimento) {
      const taskDate = new Date(task.data_vencimento);
      // Ajuste de fuso horário simples para garantir o dia correto
      const day = taskDate.getUTCDate(); 
      const month = taskDate.getUTCMonth();
      const year = taskDate.getUTCFullYear();
      
      if (month === currentDate.getMonth() && year === currentDate.getFullYear()) {
        tasksOnDays[day] = (tasksOnDays[day] || 0) + 1;
      }
    }
  });

  // Filtrar tarefas do dia selecionado
  const selectedDayTasks = tasks.filter(task => {
    if (!task.data_vencimento) return false;
    const taskDate = new Date(task.data_vencimento);
    return taskDate.getUTCDate() === selectedDay &&
           taskDate.getUTCMonth() === currentDate.getMonth() &&
           taskDate.getUTCFullYear() === currentDate.getFullYear();
  });

  return (
    <>
      <div style={{ padding: "30px" }}>
        {/* Cabeçalho */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
            Calendário
          </h1>
          <p style={{ color: "var(--text-light)", marginTop: "5px" }}>
            Visualize suas tarefas e compromissos
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
          {/* Calendário */}
          <Card style={{ padding: "25px" }}>
            {/* Navegação do mês */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 600, color: "var(--foreground)", margin: 0 }}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={previousMonth}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--card-bg)",
                    color: "var(--foreground)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextMonth}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--card-bg)",
                    color: "var(--foreground)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Dias da semana */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(7, 1fr)", 
              gap: "10px",
              marginBottom: "10px"
            }}>
              {daysOfWeek.map((day) => (
                <div 
                  key={day}
                  style={{ 
                    textAlign: "center", 
                    fontSize: "14px", 
                    fontWeight: 600,
                    color: "var(--text-light)",
                    padding: "10px 0"
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Dias do mês */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(7, 1fr)", 
              gap: "10px"
            }}>
              {days.map((dayObj, index) => (
                <div
                  key={index}
                  onClick={() => handleDayClick(dayObj.day as number)}
                  style={{
                    aspectRatio: "1",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                    background: isSelectedDay(dayObj.day as number) ? theme.colors.primary : isToday(dayObj.day as number) ? `${theme.colors.primary}40` : "transparent",
                    color: isSelectedDay(dayObj.day as number) ? "white" : dayObj.isCurrentMonth ? "var(--foreground)" : "var(--text-light)",
                    fontWeight: isSelectedDay(dayObj.day as number) || isToday(dayObj.day as number) ? 600 : 500,
                    cursor: dayObj.isCurrentMonth ? "pointer" : "default",
                    opacity: dayObj.isCurrentMonth ? 1 : 0.3,
                    position: "relative",
                    transition: "all 0.2s",
                    border: isSelectedDay(dayObj.day as number) ? `2px solid ${theme.colors.primary}` : "2px solid transparent"
                  }}
                  onMouseEnter={(e) => {
                    if (dayObj.isCurrentMonth && !isSelectedDay(dayObj.day as number)) {
                      e.currentTarget.style.background = "var(--background)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (dayObj.isCurrentMonth && !isSelectedDay(dayObj.day as number)) {
                      e.currentTarget.style.background = isToday(dayObj.day as number) ? `${theme.colors.primary}40` : "transparent";
                    }
                  }}
                >
                  <span style={{ fontSize: "15px" }}>{dayObj.day}</span>
                  {dayObj.isCurrentMonth && tasksOnDays[dayObj.day as number] && (
                    <div style={{
                      position: "absolute",
                      bottom: "5px",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: isSelectedDay(dayObj.day as number) ? "white" : theme.colors.primary
                    }} />
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Tarefas do dia */}
          <Card style={{ padding: "25px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--foreground)", marginBottom: "20px" }}>
              Tarefas do Dia {selectedDay}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {selectedDayTasks.length === 0 ? (
                <div style={{
                  padding: "20px",
                  borderRadius: "10px",
                  background: "var(--background)",
                  textAlign: "center",
                  marginTop: "10px"
                }}>
                  <p style={{ fontSize: "13px", color: "var(--text-light)", margin: 0 }}>
                    Nenhuma tarefa para este dia
                  </p>
                </div>
              ) : (
                selectedDayTasks.map((task: any) => (
                  <div 
                    key={task.id} 
                    onClick={() => handleTaskClick(task)}
                    style={{
                      padding: "15px",
                      borderRadius: "10px",
                      background: "var(--background)",
                      borderLeft: `3px solid ${theme.colors.primary}`,
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(5px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}
                  >
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)", margin: 0, marginBottom: "5px" }}>
                      {task.titulo}
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--text-light)", margin: 0 }}>
                      {task.prioridade}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        task={selectedTask}
        mode="edit"
      />
    </>
  );
}
