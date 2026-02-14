import { theme } from "@/styles/theme";
import { CheckCircle2, Circle, Lock } from "lucide-react";

export function AIMindMap() {
  const sequence = [
    { id: 1, title: "Planejar DB", status: "done" },
    { id: 2, title: "Criar API", status: "current" },
    { id: 3, title: "Frontend Login", status: "locked" },
    { id: 4, title: "Frontend Dash", status: "locked" },
  ];

  return (
    <div style={{ padding: "20px", borderTop: `1px solid ${theme.colors.border}` }}>
      <h3 style={{ fontSize: "14px", fontWeight: 700, color: theme.colors.text, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
        🧠 Fluxo IA
      </h3>
      
      <div style={{ position: "relative", paddingLeft: "10px" }}>
        {/* Vertical Line connecting everything */}
        <div style={{ 
          position: "absolute", 
          left: "19px", 
          top: "10px", 
          bottom: "20px", 
          width: "2px", 
          background: "#E5E7EB",
          zIndex: 0
        }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          {sequence.map((item, index) => {
            const isDone = item.status === "done";
            const isCurrent = item.status === "current";
            const isLocked = item.status === "locked";

            return (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative", zIndex: 1 }}>
                {/* Node Icon */}
                <div style={{ 
                  width: "28px", 
                  height: "28px", 
                  borderRadius: "50%", 
                  background: isDone ? "#DCFCE7" : isCurrent ? "#DBEAFE" : "#F3F4F6",
                  border: `2px solid ${isDone ? "#22C55E" : isCurrent ? "#3B82F6" : "#D1D5DB"}`,
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  color: isDone ? "#15803D" : isCurrent ? "#1D4ED8" : "#6B7280",
                  boxShadow: isCurrent ? "0 0 0 3px #DBEAFE" : "none",
                  flexShrink: 0
                }}>
                  {isDone ? <CheckCircle2 size={14} /> : isLocked ? <Lock size={12} /> : <Circle size={12} />}
                </div>

                {/* Node Content */}
                <div style={{ 
                  background: isCurrent ? "white" : "transparent",
                  border: isCurrent ? `1px solid ${theme.colors.primary}` : "none",
                  padding: isCurrent ? "8px 12px" : "0",
                  borderRadius: "8px",
                  boxShadow: isCurrent ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
                  flex: 1
                }}>
                  <p style={{ 
                    fontSize: "13px", 
                    fontWeight: isCurrent ? 600 : 500, 
                    color: isLocked ? theme.colors.textLight : theme.colors.text,
                    margin: 0,
                    lineHeight: 1.3
                  }}>
                    {item.title}
                  </p>
                  {isCurrent && (
                    <p style={{ fontSize: "10px", color: theme.colors.primary, marginTop: "3px", margin: "3px 0 0 0" }}>
                      Agora
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
