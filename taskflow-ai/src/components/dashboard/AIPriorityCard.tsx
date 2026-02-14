import { theme } from "@/styles/theme";
import { Card } from "../ui/Card";
import { Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";

interface AIPriorityCardProps {
  taskTitle: string;
  reason: string;
  impact: string;
  onStart: () => void;
}

export function AIPriorityCard({ taskTitle, reason, impact, onStart }: AIPriorityCardProps) {
  return (
    <Card style={{ 
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, #4338CA 100%)`,
      color: "white",
      border: "none",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{ position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
          <div style={{ 
            background: "rgba(255,255,255,0.2)", 
            padding: "6px 12px", 
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            fontWeight: 600
          }}>
            <Sparkles size={14} />
            Sugestão da IA
          </div>
          <span style={{ fontSize: "12px", opacity: 0.9 }}>Baseado em prazo e dependências</span>
        </div>

        <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "10px", lineHeight: 1.2 }}>
          {taskTitle}
        </h2>

        <div style={{ 
          background: "rgba(0,0,0,0.2)", 
          padding: "15px", 
          borderRadius: theme.radius.md,
          marginBottom: "20px",
          borderLeft: "4px solid #FCD34D"
        }}>
          <p style={{ fontSize: "14px", marginBottom: "5px", display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertCircle size={16} color="#FCD34D" />
            <strong>Por que agora?</strong> {reason}
          </p>
          <p style={{ fontSize: "14px", opacity: 0.9, marginLeft: "24px" }}>
            🚀 {impact}
          </p>
        </div>

      </div>

      {/* Decorative background elements */}
      <div style={{ 
        position: "absolute", 
        top: "-20px", 
        right: "-20px", 
        width: "200px", 
        height: "200px", 
        background: "rgba(255,255,255,0.1)", 
        borderRadius: "50%",
        filter: "blur(40px)"
      }} />
    </Card>
  );
}
