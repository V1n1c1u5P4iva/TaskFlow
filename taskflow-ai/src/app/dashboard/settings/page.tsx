"use client";

import { theme } from "@/styles/theme";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { User, Bell, Lock, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { getCurrentLanguage, setLanguage, t, genderOptions, occupationOptions, languageOptions, Language } from "@/lib/i18n";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("perfil");
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>('pt');
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    idade: "",
    genero: "",
    ocupacao: "",
  });

  useEffect(() => {
    loadUserData();
    setCurrentLang(getCurrentLanguage());
    
    const handleLanguageChange = () => {
      setCurrentLang(getCurrentLanguage());
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const loadUserData = () => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserData(parsedUser);
      setFormData({
        nome: parsedUser.nome || "",
        email: parsedUser.email || "",
        idade: parsedUser.idade?.toString() || "",
        genero: parsedUser.genero || "",
        ocupacao: parsedUser.ocupacao || "",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Language;
    setLanguage(newLang);
    setCurrentLang(newLang);
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const updateData = {
        nome: formData.nome,
        email: formData.email,
        idade: parseInt(formData.idade),
        ocupacao: formData.ocupacao,
        genero: formData.genero
      };

      const response = await api.updateProfile(token, updateData);
      
      localStorage.setItem("user", JSON.stringify(response.user));
      setUserData(response.user);
      // Profile saved successfully - reload sidebar user info
      window.dispatchEvent(new Event("userUpdated"));
      alert("✅ " + t('save', currentLang) + " com sucesso!");
    } catch (err) {
      console.error(err);
      alert("❌ Erro ao atualizar perfil. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "perfil", label: t('profile', currentLang), icon: User },
    { id: "notificacoes", label: t('notifications', currentLang), icon: Bell },
    { id: "seguranca", label: t('security', currentLang), icon: Lock },
    { id: "preferencias", label: t('preferences', currentLang), icon: Globe },
  ];

  return (
    <>
      <div style={{ padding: "30px" }}>
        {/* Cabeçalho */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
            {t('settings', currentLang)}
          </h1>
          <p style={{ color: "var(--text-light)", marginTop: "5px" }}>
            {t('settingsSubtitle', currentLang)}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "20px" }}>
          {/* Menu lateral */}
          <Card style={{ padding: "15px", height: "fit-content" }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "12px 15px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                    background: activeTab === tab.id ? `${theme.colors.primary}15` : "transparent",
                    color: activeTab === tab.id ? theme.colors.primary : "var(--foreground)",
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    marginBottom: "5px",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.background = "var(--background)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </div>
              );
            })}
          </Card>

          {/* Conteúdo */}
          <Card style={{ padding: "30px" }}>
            {activeTab === "perfil" && (
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 600, color: "var(--foreground)", marginBottom: "20px" }}>
                  {t('profileInfo', currentLang)}
                </h2>
                
                <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px" }}>
                  <div style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: `${theme.colors.primary}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: theme.colors.primary
                  }}>
                    <User size={40} />
                  </div>
                  <div>
                    <p style={{ fontSize: "18px", fontWeight: 600, color: "var(--foreground)", margin: 0 }}>
                      {userData?.nome || "Usuário"}
                    </p>
                    <p style={{ fontSize: "14px", color: "var(--text-light)", margin: "5px 0 0 0" }}>
                      {userData?.email || "usuario@email.com"}
                    </p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <Input 
                    label={t('fullName', currentLang)}
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Seu nome"
                  />
                  <Input 
                    label={t('email', currentLang)}
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                  />
                  <Input 
                    label={t('age', currentLang)}
                    type="number"
                    name="idade"
                    value={formData.idade}
                    onChange={handleChange}
                    placeholder="25"
                  />
                  
                  {/* Gender Dropdown */}
                  <div>
                    <label style={{
                      fontSize: "14px",
                      marginBottom: "5px",
                      display: "block",
                      color: "var(--foreground)",
                      fontWeight: 500
                    }}>
                      {t('gender', currentLang)}
                    </label>
                    <select
                      name="genero"
                      value={formData.genero}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        height: "45px",
                        padding: "0 12px",
                        borderRadius: "10px",
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                        background: "var(--card-bg)",
                        fontSize: "15px",
                        outline: "none",
                        cursor: "pointer",
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

                  {/* Occupation Dropdown */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{
                      fontSize: "14px",
                      marginBottom: "5px",
                      display: "block",
                      color: "var(--foreground)",
                      fontWeight: 500
                    }}>
                      {t('occupation', currentLang)}
                    </label>
                    <select
                      name="ocupacao"
                      value={formData.ocupacao}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        height: "45px",
                        padding: "0 12px",
                        borderRadius: "10px",
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                        background: "var(--card-bg)",
                        fontSize: "15px",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    >
                      <option value="">Selecione sua ocupação</option>
                      {occupationOptions[currentLang].map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
                  <Button onClick={handleSaveProfile} disabled={isLoading}>
                    {isLoading ? t('loading', currentLang) : t('save', currentLang)}
                  </Button>
                  <Button 
                    onClick={loadUserData}
                    style={{ background: "transparent", color: "var(--foreground)", border: "1px solid var(--border)" }}
                  >
                    {t('cancel', currentLang)}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "notificacoes" && (
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 600, color: "var(--foreground)", marginBottom: "20px" }}>
                  Preferências de Notificação
                </h2>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {[
                    { title: "Notificações por Email", desc: "Receba atualizações sobre suas tarefas por email" },
                    { title: "Notificações Push", desc: "Receba notificações no navegador" },
                    { title: "Lembretes de Tarefas", desc: "Seja notificado sobre tarefas próximas do vencimento" },
                    { title: "Resumo Semanal", desc: "Receba um resumo semanal de suas atividades" },
                  ].map((item, index) => (
                    <div 
                      key={index}
                      style={{
                        padding: "20px",
                        borderRadius: "10px",
                        background: "var(--background)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--foreground)", margin: 0, marginBottom: "5px" }}>
                          {item.title}
                        </p>
                        <p style={{ fontSize: "13px", color: "var(--text-light)", margin: 0 }}>
                          {item.desc}
                        </p>
                      </div>
                      <label style={{ position: "relative", display: "inline-block", width: "50px", height: "26px" }}>
                        <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} defaultChecked={index < 2} />
                        <span style={{
                          position: "absolute",
                          cursor: "pointer",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: index < 2 ? theme.colors.primary : "#ccc",
                          borderRadius: "26px",
                          transition: "0.4s"
                        }}>
                          <span style={{
                            position: "absolute",
                            content: "",
                            height: "20px",
                            width: "20px",
                            left: index < 2 ? "27px" : "3px",
                            bottom: "3px",
                            background: "white",
                            borderRadius: "50%",
                            transition: "0.4s"
                          }} />
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "seguranca" && (
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 600, color: "var(--foreground)", marginBottom: "20px" }}>
                  Segurança da Conta
                </h2>
                
                <div style={{ marginBottom: "30px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--foreground)", marginBottom: "15px" }}>
                    Alterar Senha
                  </h3>
                  <Input label="Senha Atual" type="password" placeholder="********" />
                  <Input label="Nova Senha" type="password" placeholder="********" />
                  <Input label="Confirmar Nova Senha" type="password" placeholder="********" />
                  <Button style={{ marginTop: "15px" }}>Atualizar Senha</Button>
                </div>

                <div style={{
                  padding: "20px",
                  borderRadius: "10px",
                  background: "#EF444415",
                  border: "1px solid #EF444430"
                }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#EF4444", marginBottom: "10px" }}>
                    Zona de Perigo
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--text-light)", marginBottom: "15px" }}>
                    Ações irreversíveis que afetam sua conta permanentemente
                  </p>
                  <Button style={{ background: "#EF4444", color: "white" }}>
                    Excluir Conta
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "aparencia" && (
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 600, color: "var(--foreground)", marginBottom: "20px" }}>
                  Personalização de Aparência
                </h2>
                
                <div style={{ marginBottom: "30px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--foreground)", marginBottom: "15px" }}>
                    Tema
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--text-light)", marginBottom: "15px" }}>
                    Use o botão no Header para alternar entre modo claro e escuro
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px" }}>
                    <div style={{
                      padding: "20px",
                      borderRadius: "10px",
                      border: "2px solid var(--border)",
                      textAlign: "center",
                      cursor: "pointer"
                    }}>
                      <div style={{
                        width: "100%",
                        height: "100px",
                        borderRadius: "8px",
                        background: "#FFFFFF",
                        marginBottom: "10px",
                        border: "1px solid #E5E5E5"
                      }} />
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)", margin: 0 }}>
                        Modo Claro
                      </p>
                    </div>
                    <div style={{
                      padding: "20px",
                      borderRadius: "10px",
                      border: "2px solid var(--border)",
                      textAlign: "center",
                      cursor: "pointer"
                    }}>
                      <div style={{
                        width: "100%",
                        height: "100px",
                        borderRadius: "8px",
                        background: "#1C1C1C",
                        marginBottom: "10px"
                      }} />
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)", margin: 0 }}>
                        Modo Escuro
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "preferencias" && (
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 600, color: "var(--foreground)", marginBottom: "20px" }}>
                  {t('preferences', currentLang)}
                </h2>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)", display: "block", marginBottom: "10px" }}>
                      {t('language', currentLang)}
                    </label>
                    <select 
                      value={currentLang}
                      onChange={handleLanguageChange}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid var(--border)",
                        background: "var(--card-bg)",
                        color: "var(--foreground)",
                        fontSize: "15px",
                        cursor: "pointer"
                      }}
                    >
                      {languageOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)", display: "block", marginBottom: "10px" }}>
                      Fuso Horário
                    </label>
                    <select style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      background: "var(--card-bg)",
                      color: "var(--foreground)",
                      fontSize: "15px"
                    }}>
                      <option>América/São Paulo (GMT-3)</option>
                      <option>América/New York (GMT-5)</option>
                      <option>Europa/Londres (GMT+0)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)", display: "block", marginBottom: "10px" }}>
                      Formato de Data
                    </label>
                    <select style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      background: "var(--card-bg)",
                      color: "var(--foreground)",
                      fontSize: "15px"
                    }}>
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  <Button style={{ marginTop: "15px", width: "fit-content" }}>
                    {t('save', currentLang)} Preferências
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
