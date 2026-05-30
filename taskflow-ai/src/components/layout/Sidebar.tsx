"use client";

import { theme } from "@/styles/theme";
import { LayoutDashboard, CheckSquare, Settings, LogOut, Calendar, Sparkles, Brain } from "lucide-react";
import { SidebarLink } from "../ui/SidebarLink";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { auth } from "@/lib/auth";

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(auth.getUser());
    const handleUserUpdated = () => setUser(auth.getUser());
    window.addEventListener("userUpdated", handleUserUpdated);
    return () => window.removeEventListener("userUpdated", handleUserUpdated);
  }, []);
  
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Brain, label: "Fluxo IA", href: "/dashboard/fluxo" },
    { icon: Sparkles, label: "Insights IA", href: "/dashboard/insights" },
    { icon: CheckSquare, label: "Tarefas", href: "/dashboard/tasks" },
    { icon: Calendar, label: "Calendário", href: "/dashboard/calendar" },
    { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
  ];

  return (
    <aside style={{ 
      width: "260px", 
      height: "100vh", 
      background: "var(--sidebar-bg)", 
      borderRight: `1px solid var(--border)`,
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{ padding: "30px", borderBottom: `1px solid var(--border)` }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: theme.colors.primary, margin: 0 }}>
          TaskFlow<span style={{ color: "var(--foreground)" }}>AI</span>
        </h1>
      </div>

      <nav style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {menuItems.map((item) => (
            <li key={item.href} style={{ marginBottom: "8px" }}>
              <SidebarLink {...item} isActive={pathname === item.href} />
            </li>
          ))}
        </ul>
      </nav>

      <div style={{ padding: "20px", borderTop: `1px solid var(--border)` }}>
        {user && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px",
            marginBottom: "8px",
            borderRadius: "10px",
            background: "var(--background)"
          }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: `${theme.colors.primary}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.colors.primary,
              fontWeight: 700,
              fontSize: "15px",
              flexShrink: 0
            }}>
              {user.nome?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.nome}
              </p>
              <p style={{ fontSize: "12px", color: "var(--text-light)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.email}
              </p>
            </div>
          </div>
        )}
        <button 
          onClick={() => auth.logout()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            padding: "12px",
            background: "none",
            border: "none",
            color: "#EF4444",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: 500
          }}
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </aside>
  );
}
