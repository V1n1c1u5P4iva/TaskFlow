"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import GlobalThemeToggle from "@/components/ui/GlobalThemeToggle";
import { ReactNode } from "react";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
