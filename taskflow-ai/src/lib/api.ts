// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Types
export interface RegisterData {
  nome: string;
  idade: number;
  email: string;
  senha: string;
  genero: string;
  ocupacao: string;
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    nome: string;
    email: string;
    idade: number;
    genero: string;
    ocupacao: string;
  };
}

export interface ApiError {
  detail: string;
}

export interface Task {
  id: number;
  user_id: number;
  titulo: string;
  descricao?: string;
  status: 'pendente' | 'em_progresso' | 'concluida';
  prioridade: 'baixa' | 'media' | 'alta';
  data_vencimento?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskStats {
  total: number;
  by_status: Record<string, number>;
  by_priority: Record<string, number>;
}

export interface UpdateProfileData {
  nome?: string;
  idade?: number;
  genero?: string;
  ocupacao?: string;
  email?: string;
}

export interface CreateTaskData {
  titulo: string;
  descricao?: string;
  status?: string;
  prioridade?: string;
  data_vencimento?: string;
}

export interface UpdateTaskData {
  titulo?: string;
  descricao?: string;
  status?: string;
  prioridade?: string;
  data_vencimento?: string;
}

// API Service
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    console.log("API Service initialized with URL:", this.baseUrl);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        // Token expirado ou inválido — limpa sessão e redireciona para login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
      const error: ApiError = await response.json().catch(() => ({
        detail: 'Erro ao processar requisição'
      }));
      throw new Error(error.detail || `Erro HTTP: ${response.status}`);
    }
    return response.json();
  }

  private getHeaders(token?: string) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // Auth Methods
  async registerUser(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async loginUser(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async updateProfile(token: string, data: UpdateProfileData): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/me`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  // Task Methods
  async getTasks(token: string): Promise<Task[]> {
    const response = await fetch(`${this.baseUrl}/api/tasks/`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });
    return this.handleResponse<Task[]>(response);
  }

  async createTask(token: string, data: CreateTaskData): Promise<Task> {
    const response = await fetch(`${this.baseUrl}/api/tasks/`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Task>(response);
  }

  async updateTask(token: string, taskId: number, data: UpdateTaskData): Promise<Task> {
    const response = await fetch(`${this.baseUrl}/api/tasks/${taskId}/`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Task>(response);
  }

  async deleteTask(token: string, taskId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/tasks/${taskId}/`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });
    if (!response.ok) {
      throw new Error(`Erro ao deletar tarefa: ${response.status}`);
    }
  }

  async getTaskStats(token: string): Promise<TaskStats> {
    const response = await fetch(`${this.baseUrl}/api/tasks/stats/overview`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });
    return this.handleResponse<TaskStats>(response);
  }

  // AI Methods (Google Gemini)
  async generateFlowWithAI(token: string, objetivo: string): Promise<any> {
    const prompt = `Crie um fluxo de tarefas detalhado para o seguinte objetivo: "${objetivo}". 
    Retorne APENAS um JSON com a seguinte estrutura:
    {
      "steps": [
        {
          "id": 1,
          "title": "Título da tarefa",
          "description": "Descrição detalhada",
          "estimatedTime": "2 horas",
          "dependencies": [],
          "status": "locked"
        }
      ],
      "recommendation": "Uma recomendação geral"
    }`;

    const response = await fetch(`${this.baseUrl}/api/ai/generate`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify({ prompt }),
    });
    const data = await this.handleResponse<{ response: string }>(response);
    
    try {
      // O backend retorna { response: "texto gerado" }
      // Precisamos fazer o parse do texto gerado que deve ser um JSON
      const jsonStr = data.response.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Erro ao fazer parse da resposta da IA", e);
      return { steps: [], recommendation: "Erro ao processar resposta da IA" };
    }
  }

  async getInsightsWithAI(token: string, customPrompt?: string): Promise<any> {
    const defaultPrompt = `Analise as tarefas pendentes e sugira qual deve ser priorizada.
    Retorne APENAS um JSON com a seguinte estrutura:
    {
      "insights": [
        {
          "title": "Tarefa a priorizar",
          "reason": "Motivo da prioridade",
          "impact": "Impacto na produtividade",
          "message": "Mensagem motivacional"
        }
      ]
    }`;

    const prompt = customPrompt || defaultPrompt;

    const response = await fetch(`${this.baseUrl}/api/ai/generate`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify({ prompt }),
    });
    const data = await this.handleResponse<{ response: string }>(response);
    
    try {
      const jsonStr = data.response.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Erro ao fazer parse da resposta da IA", e);
      return { insights: [] };
    }
  }
}

export const api = new ApiService(API_BASE_URL);
