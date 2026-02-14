import { theme } from "@/styles/theme";
import { Card } from "../ui/Card";

interface TaskCardProps {
  title: string;
  description: string;
  status: "Em andamento" | "Pendente" | "Atrasada" | "Concluída";
  onClick?: () => void;
}

export function TaskCard({ title, description, status, onClick }: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em andamento": return { bg: "#FECACA", text: "#991B1B" }; // Vermelho/Rosa da imagem
      case "Pendente": return { bg: "#FDE68A", text: "#92400E" }; // Amarelo
      case "Atrasada": return { bg: "#FECACA", text: "#991B1B" }; // Vermelho
      case "Concluída": return { bg: "#D1FAE5", text: "#065F46" }; // Verde
      default: return { bg: "#E5E7EB", text: "#374151" };
    }
  };

  const colors = getStatusColor(status);

  return (
    <Card style={{ 
      padding: "24px", 
      display: "flex", 
      flexDirection: "column", 
      gap: "12px",
      height: "100%",
      justifyContent: "space-between",
      cursor: onClick ? "pointer" : "default",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
    onMouseEnter={(e) => {
      if (onClick) {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
      }
    }}
    onMouseLeave={(e) => {
      if (onClick) {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }
    }}
    onClick={onClick}
    >
      <div>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", marginBottom: "8px" }}>
          {title}
        </h3>
        <p style={{ fontSize: "14px", color: "var(--text-light)", lineHeight: "1.5" }}>
          {description}
        </p>
      </div>
      
      <div style={{
        alignSelf: "flex-start",
        padding: "4px 12px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: 600,
        background: colors.bg,
        color: colors.text
      }}>
        {status}
      </div>
    </Card>
  );
}
