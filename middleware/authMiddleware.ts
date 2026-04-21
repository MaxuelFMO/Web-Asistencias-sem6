/**
 * Auth Middleware - Protege rutas autenticadas
 */

import { authService } from '@/services/api';

export interface AuthContext {
  isAuthenticated: boolean;
  token: string | null;
}

/**
 * Middleware para verificar autenticación en el cliente
 */
export const checkAuthentication = (): AuthContext => {
  const token = authService.getToken();
  const isAuthenticated = authService.isAuthenticated();

  return {
    isAuthenticated,
    token,
  };
};

/**
 * Hook para usar en componentes
 */
export const useAuth = () => {
  return checkAuthentication();
};

export default checkAuthentication;
