// i18n Configuration
export const translations = {
  pt: {
    // Common
    save: "Salvar",
    cancel: "Cancelar",
    loading: "Carregando...",
    
    // Settings
    settings: "Configurações",
    settingsSubtitle: "Gerencie suas preferências e configurações da conta",
    profile: "Perfil",
    notifications: "Notificações",
    security: "Segurança",
    preferences: "Preferências",
    profileInfo: "Informações do Perfil",
    fullName: "Nome Completo",
    email: "Email",
    age: "Idade",
    gender: "Gênero",
    occupation: "Ocupação",
    language: "Idioma",
    selectLanguage: "Selecione o idioma",
    
    // Gender options
    male: "Masculino",
    female: "Feminino",
    other: "Outro",
    preferNotToSay: "Prefiro não dizer",
    
    // Occupation options
    developer: "Desenvolvedor(a)",
    designer: "Designer",
    manager: "Gerente",
    student: "Estudante",
    teacher: "Professor(a)",
    engineer: "Engenheiro(a)",
    doctor: "Médico(a)",
    lawyer: "Advogado(a)",
    entrepreneur: "Empreendedor(a)",
    freelancer: "Freelancer",
    other_occupation: "Outro",
    
    // Registration
    createAccount: "Criar Conta",
    alreadyHaveAccount: "Já tem uma conta?",
    login: "Entrar",
    register: "Cadastrar",
  },
  es: {
    // Common
    save: "Guardar",
    cancel: "Cancelar",
    loading: "Cargando...",
    
    // Settings
    settings: "Configuración",
    settingsSubtitle: "Administre sus preferencias y configuración de cuenta",
    profile: "Perfil",
    notifications: "Notificaciones",
    security: "Seguridad",
    preferences: "Preferencias",
    profileInfo: "Información del Perfil",
    fullName: "Nombre Completo",
    email: "Correo",
    age: "Edad",
    gender: "Género",
    occupation: "Ocupación",
    language: "Idioma",
    selectLanguage: "Seleccione el idioma",
    
    // Gender options
    male: "Masculino",
    female: "Femenino",
    other: "Otro",
    preferNotToSay: "Prefiero no decir",
    
    // Occupation options
    developer: "Desarrollador(a)",
    designer: "Diseñador(a)",
    manager: "Gerente",
    student: "Estudiante",
    teacher: "Profesor(a)",
    engineer: "Ingeniero(a)",
    doctor: "Médico(a)",
    lawyer: "Abogado(a)",
    entrepreneur: "Emprendedor(a)",
    freelancer: "Freelancer",
    other_occupation: "Otro",
    
    // Registration
    createAccount: "Crear Cuenta",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    login: "Iniciar sesión",
    register: "Registrarse",
  },
  en: {
    // Common
    save: "Save",
    cancel: "Cancel",
    loading: "Loading...",
    
    // Settings
    settings: "Settings",
    settingsSubtitle: "Manage your preferences and account settings",
    profile: "Profile",
    notifications: "Notifications",
    security: "Security",
    preferences: "Preferences",
    profileInfo: "Profile Information",
    fullName: "Full Name",
    email: "Email",
    age: "Age",
    gender: "Gender",
    occupation: "Occupation",
    language: "Language",
    selectLanguage: "Select language",
    
    // Gender options
    male: "Male",
    female: "Female",
    other: "Other",
    preferNotToSay: "Prefer not to say",
    
    // Occupation options
    developer: "Developer",
    designer: "Designer",
    manager: "Manager",
    student: "Student",
    teacher: "Teacher",
    engineer: "Engineer",
    doctor: "Doctor",
    lawyer: "Lawyer",
    entrepreneur: "Entrepreneur",
    freelancer: "Freelancer",
    other_occupation: "Other",
    
    // Registration
    createAccount: "Create Account",
    alreadyHaveAccount: "Already have an account?",
    login: "Login",
    register: "Register",
  },
};

export type Language = 'pt' | 'es' | 'en';
export type TranslationKey = keyof typeof translations.pt;

export const genderOptions: Record<Language, Array<{value: string, label: string}>> = {
  pt: [
    { value: "masculino", label: "Masculino" },
    { value: "feminino", label: "Feminino" },
    { value: "outro", label: "Outro" },
    { value: "prefiro_nao_dizer", label: "Prefiro não dizer" },
  ],
  es: [
    { value: "masculino", label: "Masculino" },
    { value: "feminino", label: "Femenino" },
    { value: "outro", label: "Otro" },
    { value: "prefiro_nao_dizer", label: "Prefiero no decir" },
  ],
  en: [
    { value: "masculino", label: "Male" },
    { value: "feminino", label: "Female" },
    { value: "outro", label: "Other" },
    { value: "prefiro_nao_dizer", label: "Prefer not to say" },
  ],
};

export const occupationOptions: Record<Language, Array<{value: string, label: string}>> = {
  pt: [
    { value: "desenvolvedor", label: "Desenvolvedor(a)" },
    { value: "designer", label: "Designer" },
    { value: "gerente", label: "Gerente" },
    { value: "estudante", label: "Estudante" },
    { value: "professor", label: "Professor(a)" },
    { value: "engenheiro", label: "Engenheiro(a)" },
    { value: "medico", label: "Médico(a)" },
    { value: "advogado", label: "Advogado(a)" },
    { value: "empreendedor", label: "Empreendedor(a)" },
    { value: "freelancer", label: "Freelancer" },
    { value: "outro", label: "Outro" },
  ],
  es: [
    { value: "desenvolvedor", label: "Desarrollador(a)" },
    { value: "designer", label: "Diseñador(a)" },
    { value: "gerente", label: "Gerente" },
    { value: "estudante", label: "Estudiante" },
    { value: "professor", label: "Profesor(a)" },
    { value: "engenheiro", label: "Ingeniero(a)" },
    { value: "medico", label: "Médico(a)" },
    { value: "advogado", label: "Abogado(a)" },
    { value: "empreendedor", label: "Emprendedor(a)" },
    { value: "freelancer", label: "Freelancer" },
    { value: "outro", label: "Otro" },
  ],
  en: [
    { value: "desenvolvedor", label: "Developer" },
    { value: "designer", label: "Designer" },
    { value: "gerente", label: "Manager" },
    { value: "estudante", label: "Student" },
    { value: "professor", label: "Teacher" },
    { value: "engenheiro", label: "Engineer" },
    { value: "medico", label: "Doctor" },
    { value: "advogado", label: "Lawyer" },
    { value: "empreendedor", label: "Entrepreneur" },
    { value: "freelancer", label: "Freelancer" },
    { value: "outro", label: "Other" },
  ],
};

export const languageOptions = [
  { value: "pt", label: "Português" },
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
];

// Get current language from localStorage or default to PT
export const getCurrentLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('language');
    if (saved && (saved === 'pt' || saved === 'es' || saved === 'en')) {
      return saved as Language;
    }
  }
  return 'pt';
};

// Set language in localStorage
export const setLanguage = (lang: Language) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
    window.dispatchEvent(new Event('languageChange'));
  }
};

// Get translation
export const t = (key: TranslationKey, lang?: Language): string => {
  const currentLang = lang || getCurrentLanguage();
  return translations[currentLang][key] || translations.pt[key] || key;
};
