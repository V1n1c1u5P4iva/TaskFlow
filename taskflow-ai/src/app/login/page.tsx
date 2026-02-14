"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { theme } from "@/styles/theme";
import { CheckCircle2, Moon, Sun, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { theme: currentTheme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    senha: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.loginUser({
        email: formData.email,
        senha: formData.senha
      });

      localStorage.setItem("authToken", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      router.push("/dashboard");
    } catch (err) {
      setError("Email ou senha inválidos. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="h-screen flex" style={{ position: "relative" }}>
      {/* Botão de tema */}
      <button 
        onClick={toggleTheme}
        style={{ 
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 9999,
          background: "var(--card-bg)", 
          border: `1px solid var(--border)`,
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "var(--foreground)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {currentTheme === "light" ? <Moon size={22} /> : <Sun size={22} />}
      </button>
      {/* Lado esquerdo - Branding */}
      <div className="flex-1 flex flex-col items-center justify-center text-white p-10 relative overflow-hidden"
           style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, #4338CA 100%)` }}>
        
        <div className="relative z-10 max-w-lg">
          <h1 className="text-6xl font-extrabold mb-6">TaskFlow AI</h1>
          <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
            Gerencie seus projetos com a inteligência que você precisa. 
            Automatize tarefas, acompanhe o progresso e alcance seus objetivos.
          </p>
          
          <div className="space-y-4">
            {["Organização inteligente", "Analytics em tempo real", "Colaboração simplificada"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-indigo-50">
                <CheckCircle2 size={24} className="text-indigo-300" />
                <span className="text-lg font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-400 blur-3xl" />
        </div>
      </div>

      {/* Lado direito - Login Form */}
      <div className="flex-1 flex items-center justify-center p-10" style={{ background: "var(--background)" }}>
        <Card style={{ width: "100%", maxWidth: "450px", padding: "40px" }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Bem-vindo de volta</h2>
            <p style={{ color: "var(--text-light)" }}>Entre com suas credenciais para acessar</p>
          </div>

          <form onSubmit={handleLogin}>
            <Input 
              label="Email" 
              placeholder="seu@email.com" 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <div className="mb-6">
              <Input 
                label="Senha" 
                type="password" 
                placeholder="********" 
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required
              />
              <div className="flex justify-end mt-2">
                <a href="#" className="text-sm font-medium hover:underline" style={{ color: theme.colors.primary }}>
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            {error && (
              <div 
                style={{
                  padding: "12px 16px",
                  borderRadius: theme.radius.md,
                  backgroundColor: "#FEE2E2",
                  border: "1px solid #FCA5A5",
                  marginBottom: "20px",
                }}
              >
                <p style={{ color: "#DC2626", fontSize: "14px", margin: 0 }}>
                  {error}
                </p>
              </div>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Entrando...</span>
                </div>
              ) : (
                "Entrar na Plataforma"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm" style={{ color: "var(--text-light)" }}>
            Não tem uma conta?{" "}
            <a href="/cadastro" className="font-semibold hover:underline" style={{ color: theme.colors.primary }}>
              Crie agora
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}
