"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { theme } from "@/styles/theme";
import { CheckCircle2, UserPlus, Loader2, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api, RegisterData } from "@/lib/api";
import { useTheme } from "@/contexts/ThemeContext";
import { getCurrentLanguage, t, genderOptions, occupationOptions, Language } from "@/lib/i18n";
import { auth } from "@/lib/auth";

export default function CadastroPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme: currentTheme, toggleTheme } = useTheme();
  const [currentLang, setCurrentLang] = useState<Language>('pt');
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    genero: "",
    ocupacao: "",
  });

  useEffect(() => {
    if (auth.isAuthenticated()) {
      router.replace("/dashboard");
      return;
    }
    setCurrentLang(getCurrentLanguage());
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validação básica
    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem!");
      return;
    }

    if (formData.senha.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres!");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Preparar dados para envio
      const registerData: RegisterData = {
        nome: formData.nome,
        idade: parseInt(formData.idade),
        email: formData.email,
        senha: formData.senha,
        genero: formData.genero,
        ocupacao: formData.ocupacao,
      };

      // Enviar para API
      const response = await api.registerUser(registerData);
      
      // Salvar token
      localStorage.setItem("authToken", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      // Redirecionar para dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
      <div 
        className="flex-1 flex flex-col items-center justify-center text-white p-10 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, #4338CA 100%)` }}
      >
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-6">
            <UserPlus size={48} className="text-indigo-200" />
            <h1 className="text-6xl font-extrabold">TaskFlow AI</h1>
          </div>
          
          <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
            Junte-se a milhares de usuários que transformaram sua produtividade. 
            Crie sua conta e comece a gerenciar suas tarefas de forma inteligente.
          </p>
          
          <div className="space-y-4">
            {[
              "Cadastro rápido e seguro", 
              "Interface intuitiva e moderna", 
              "Suporte dedicado 24/7"
            ].map((item) => (
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

      {/* Lado direito - Formulário de Cadastro */}
      <div className="flex-1 flex items-center justify-center p-10 overflow-y-auto" style={{ background: "var(--background)" }}>
        <Card style={{ width: "100%", maxWidth: "550px", padding: "48px", margin: "20px 0" }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--foreground)", wordBreak: "keep-all" }}>
              {t('createAccount', currentLang)}
            </h2>
            <p style={{ color: "var(--text-light)" }}>
              Preencha seus dados para começar
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Nome */}
            <Input 
              label={t('fullName', currentLang)}
              placeholder="Digite seu nome completo" 
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />

            {/* Idade e Gênero - Lado a lado */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <Input
                  label={t('age', currentLang)}
                  type="number"
                  name="idade"
                  value={formData.idade}
                  onChange={handleChange}
                  placeholder="Ex: 25"
                  min="13"
                  max="120"
                  required
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-semibold mb-2" 
                  style={{ color: "var(--foreground)" }}
                >
                  {t('gender', currentLang)}
                </label>
                <select
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: theme.radius.md,
                    border: `1px solid var(--border)`,
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.2s",
                    backgroundColor: "var(--card-bg)",
                    color: "var(--foreground)",
                    cursor: "pointer",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.colors.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}15`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="">Selecione</option>
                  {genderOptions[currentLang].map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email */}
            <Input 
              label={t('email', currentLang)}
              placeholder="seu@email.com" 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Ocupação */}
            <div className="mb-6">
              <label 
                className="block text-sm font-semibold mb-2" 
                style={{ color: "var(--foreground)" }}
              >
                {t('occupation', currentLang)}
              </label>
              <select
                name="ocupacao"
                value={formData.ocupacao}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: theme.radius.md,
                  border: `1px solid var(--border)`,
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.2s",
                  backgroundColor: "var(--card-bg)",
                  color: "var(--foreground)",
                  cursor: "pointer",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}15`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="">{t('selectLanguage', currentLang).replace('idioma', 'ocupação')}</option>
                {occupationOptions[currentLang].map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Senha */}
            <Input 
              label="Senha" 
              type="password" 
              placeholder="Mínimo 8 caracteres"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              minLength={8}
            />

            {/* Confirmar Senha */}
            <div className="mb-6">
              <Input 
                label="Confirmar Senha" 
                type="password" 
                placeholder="Digite a senha novamente"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>

            {/* Error Message */}
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
                  <span>Criando conta...</span>
                </div>
              ) : (
                "Criar Minha Conta"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm" style={{ color: "var(--text-light)" }}>
            Já tem uma conta?{" "}
            <a 
              href="/login" 
              className="font-semibold hover:underline" 
              style={{ color: theme.colors.primary }}
            >
              Faça login
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
