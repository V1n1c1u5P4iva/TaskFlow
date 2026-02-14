import { theme } from "@/styles/theme";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ children, style, ...props }: CardProps) {
  return (
    <div
      style={{
        background: "var(--card-bg)",
        borderRadius: theme.radius.md,
        border: `1px solid var(--border)`,
        padding: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
