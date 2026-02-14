"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

import { ToastProvider } from "@/components/ui/Toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      router.replace("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <ToastProvider>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--background)" }}>
        {/* Sidebar fixa */}
        <div style={{ flexShrink: 0 }}>
          <Sidebar />
        </div>
        
        {/* Área principal com scroll */}
        <main style={{ 
          flex: 1, 
          overflowY: "auto", 
          height: "100vh",
          position: "relative"
        }}>
          <Header />
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
