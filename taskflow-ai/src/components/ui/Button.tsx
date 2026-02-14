import { theme } from "@/styles/theme";
import React, { useState } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, ...props }: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      {...props}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: "100%",
        height: "45px",
        background: props.disabled ? theme.colors.textLight : (isHovered ? theme.colors.primaryHover : theme.colors.primary),
        color: "white",
        border: "none",
        borderRadius: theme.radius.md,
        fontSize: "16px",
        fontWeight: 600,
        cursor: props.disabled ? "not-allowed" : "pointer",
        opacity: props.disabled ? 0.6 : 1,
        transition: "background 0.2s ease",
        ...props.style,
      }}
    >
      {children}
    </button>
  );
}
