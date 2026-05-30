// Utilitários de autenticação
export const auth = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  },

  getUser: (): any | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('authToken');
  },

  logout: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  saveSession: (token: string, user: any): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
};
