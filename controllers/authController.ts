/**
 * Auth Controller - Lógica de negocio para autenticación
 */

import { authService, LoginRequest } from '@/services/api';

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  token: string | null;
}

export const initialAuthState: AuthState = {
  isLoading: false,
  isAuthenticated: false,
  error: null,
  token: null,
};

export class AuthController {
  /**
   * Maneja el login del usuario
   */
  static async handleLogin(
    credentials: LoginRequest,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ): Promise<AuthState> {
    try {
      const result = await authService.login(credentials);

      if (result.status === 'ok' && result.token) {
        onSuccess?.();
        return {
          isLoading: false,
          isAuthenticated: true,
          error: null,
          token: result.token,
        };
      }

      const error = result.mensaje || 'Error en la autenticación';
      onError?.(error);
      return {
        isLoading: false,
        isAuthenticated: false,
        error,
        token: null,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      onError?.(errorMessage);
      return {
        isLoading: false,
        isAuthenticated: false,
        error: errorMessage,
        token: null,
      };
    }
  }

  /**
   * Valida las credenciales
   */
  static validateCredentials(usuario: string, password: string): string | null {
    if (!usuario || usuario.trim().length === 0) {
      return 'El usuario es requerido';
    }

    if (!password || password.length === 0) {
      return 'La contraseña es requerida';
    }

    if (password.length < 4) {
      return 'La contraseña debe tener al menos 4 caracteres';
    }

    return null;
  }

  /**
   * Maneja el logout
   */
  static handleLogout(onSuccess?: () => void): void {
    authService.logout();
    onSuccess?.();
  }

  /**
   * Obtiene el estado de autenticación
   */
  static getAuthState(): AuthState {
    const token = authService.getToken();
    const isAuthenticated = authService.isAuthenticated();

    return {
      isLoading: false,
      isAuthenticated,
      error: null,
      token,
    };
  }

  /**
   * Verifica si hay sesión activa
   */
  static isAuthenticated(): boolean {
    return authService.isAuthenticated();
  }
}

export default AuthController;
