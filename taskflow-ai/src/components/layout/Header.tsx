"use client";

import { theme } from "@/styles/theme";
import { Bell, User, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { auth } from "@/lib/auth";

export default function Header() {
  const { theme: currentTheme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = auth.getUser();
    if (user?.nome) setUserName(user.nome.split(" ")[0]);
  }, []);

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

        {userName && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: `${theme.colors.primary}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.colors.primary,
              fontWeight: 700,
              fontSize: "14px"
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--foreground)" }}>{userName}</span>
          </div>
        )}
      </div>
    </header>
  );
}
