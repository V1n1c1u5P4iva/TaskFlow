"use client";

import { theme } from "@/styles/theme";
import { LayoutDashboard, CheckSquare, Settings, LogOut, Calendar, Sparkles, Brain } from "lucide-react";
import { SidebarLink } from "../ui/SidebarLink";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  
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
        <button 
          onClick={() => {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
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
