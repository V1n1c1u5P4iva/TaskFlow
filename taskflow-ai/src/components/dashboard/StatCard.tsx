import { theme } from "@/styles/theme";
import { Card } from "../ui/Card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <Card style={{ display: "flex", alignItems: "center", gap: "15px" }}>
      <div style={{
        width: "50px",
        height: "50px",
        borderRadius: theme.radius.md,
        background: `${theme.colors.primary}15`, // 15 é opacidade em hexadecimal
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: theme.colors.primary
      }}>
        <Icon size={24} />
      </div>
      <div>
        <p style={{ fontSize: "14px", color: theme.colors.textLight, margin: "0 0 5px 0" }}>{title}</p>
        <h3 style={{ fontSize: "24px", fontWeight: 700, color: theme.colors.text, margin: 0 }}>{value}</h3>
        {trend && (
          <p style={{ 
            fontSize: "12px", 
            color: trendUp ? "#10B981" : "#EF4444", 
            marginTop: "5px",
            fontWeight: 500 
          }}>
            {trend}
          </p>
        )}
      </div>
    </Card>
  );
}
