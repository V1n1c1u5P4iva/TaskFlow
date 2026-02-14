"use client";

import { theme } from "@/styles/theme";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface SidebarLinkProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive?: boolean;
}

export function SidebarLink({ icon: Icon, label, href, isActive = false }: SidebarLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      href={href} 
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 15px",
        borderRadius: theme.radius.md,
        color: isActive ? theme.colors.primary : theme.colors.textLight,
        background: isActive 
          ? `${theme.colors.primary}15` 
          : isHovered 
            ? theme.colors.background 
            : "transparent",
        textDecoration: "none",
        fontSize: "15px",
        fontWeight: isActive ? 600 : 500,
        transition: "all 0.2s",
        border: isActive ? `1px solid ${theme.colors.primary}30` : "1px solid transparent",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon size={20} />
      {label}
    </Link>
  );
}
