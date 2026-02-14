"use client";

import { theme } from "@/styles/theme";
import { Bell, User, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { usePathname } from "next/navigation";

export default function Header() {
  const { theme: currentTheme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard": return "Dashboard";
      case "/dashboard/fluxo": return "Fluxo IA";
      case "/dashboard/insights": return "Insights IA";
      case "/dashboard/tasks": return "Tarefas";
      case "/dashboard/calendar": return "Calendário";
      case "/dashboard/settings": return "Configurações";
      default: return "Dashboard";
    }
  };

  return (
    <header style={{
      height: "70px",
      background: "var(--card-bg)",
      borderBottom: `1px solid var(--border)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 30px",
    }}>
      <h2 style={{ fontSize: "20px", fontWeight: 600, color: "var(--foreground)" }}>
        {getPageTitle()}
      </h2>
      
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <button 
          onClick={toggleTheme}
          style={{ 
            background: "none", 
            border: "none", 
            cursor: "pointer", 
            color: "var(--text-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title={currentTheme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
        >
          {currentTheme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-light)" }}>
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
}
