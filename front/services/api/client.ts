/**
 * API Client - Configuración centralizada para todas las peticiones
 * Maneja la base URL, headers, token y métodos HTTP reutilizables
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface FetchOptions extends RequestInit {
  data?: Record<string, any>;
  params?: Record<string, any>;
}

interface ApiResponse<T = any> {
  status: 'ok' | 'error';
  data?: T;
  mensaje?: string;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  /**
   * Carga el token del localStorage
   */
  private loadToken(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  /**
   * Establece el token de autenticación
   */
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Obtiene la URL base
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Construye los headers con token si existe
   */
  private getHeaders(options: FetchOptions = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers as Record<string, string>;
  }

  /**
   * Construye query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Método GET
   */
  async get<T = any>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = this.buildUrl(endpoint, options.params);
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(options),
        ...options,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Método POST
   */
  async post<T = any>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = this.buildUrl(endpoint, options.params);
      const body = options.data ? JSON.stringify(options.data) : undefined;

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(options),
        body,
        ...options,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Método PUT
   */
  async put<T = any>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = this.buildUrl(endpoint, options.params);
      const body = options.data ? JSON.stringify(options.data) : undefined;

      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(options),
        body,
        ...options,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Método DELETE
   */
  async delete<T = any>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = this.buildUrl(endpoint, options.params);
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(options),
        ...options,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Maneja la respuesta del servidor
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.mensaje || data.message || 'Error en la solicitud',
        error: data.error,
      };
    }

    return {
      status: 'ok',
      data: data.data || data,
      mensaje: data.mensaje,
    };
  }

  /**
   * Maneja errores de red
   */
  private handleError(error: any): ApiResponse {
    console.error('API Error:', error);
    return {
      status: 'error',
      message: 'Error de conexión. Intente nuevamente.',
      error: error.message,
    };
  }
}

// Instancia global
export const apiClient = new ApiClient();

export default apiClient;
