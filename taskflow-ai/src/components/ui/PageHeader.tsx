import { theme } from "@/styles/theme";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  emoji?: string;
}

export function PageHeader({ title, subtitle, emoji }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: "40px" }}>
      <h1 style={{ 
        fontSize: "32px", 
        fontWeight: 800, 
        color: "var(--foreground)", 
        marginBottom: "10px", 
        display: "flex", 
        alignItems: "center", 
        gap: "10px" 
      }}>
        {title} {emoji && <span style={{ fontSize: "32px" }}>{emoji}</span>}
      </h1>
      {subtitle && (
        <p style={{ color: "var(--text-light)", fontSize: "16px" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
