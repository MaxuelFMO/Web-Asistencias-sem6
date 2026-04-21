/**
 * Auth Service - Gestiona todas las operaciones de autenticación
 */

import apiClient from './client';

export interface LoginRequest {
  usuario: string;
  password: string;
}

export interface LoginResponse {
  status: 'ok' | 'error';
  token?: string;
  mensaje?: string;
}

export interface User {
  id?: number;
  usuario: string;
  nombre?: string;
}

class AuthService {
  /**
   * Login del usuario
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<{ token: string }>('/login', {
      data: credentials,
    });

    if (response.status === 'ok' && response.data?.token) {
      apiClient.setToken(response.data.token);
      return {
        status: 'ok',
        token: response.data.token,
        mensaje: 'Autenticación exitosa',
      };
    }

    return {
      status: 'error',
      mensaje: response.message || 'Error en la autenticación',
    };
  }

  /**
   * Logout del usuario
   */
  logout(): void {
    apiClient.clearToken();
  }

  /**
   * Verifica si hay sesión activa
   */
  isAuthenticated(): boolean {
    return apiClient.getToken() !== null;
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return apiClient.getToken();
  }
}

export const authService = new AuthService();
export default authService;
