/**
 * Visitas Service - Gestiona todas las operaciones de visitas
 */

import apiClient from './client';

export interface RegistroVisita {
  id?: number;
  nombre: string;
  dni: string;
  persona_visitada: string;
  id_despacho: number;
  fecha?: string;
  hora_entrada?: string;
  hora_salida?: string | null;
  tiempo?: string;
}

export interface RegistroEntrada {
  nombre: string;
  dni: string;
  persona_visitada: string;
  id_despacho: number;
}

export interface FiltrosVisita {
  fecha?: string;
  nombre?: string;
  despacho?: string | number;
}

class VisitasService {
  /**
   * Registra una nueva entrada de visitante
   */
  async registrarEntrada(data: RegistroEntrada): Promise<any> {
    return apiClient.post('/visitas', {
      data,
    });
  }

  /**
   * Registra la salida de un visitante
   */
  async registrarSalida(id: number): Promise<any> {
    return apiClient.put(`/visitas/${id}`, {
      data: { hora_salida: new Date().toISOString() },
    });
  }

  /**
   * Obtiene lista de visitas con filtros opcionales
   */
  async obtenerVisitas(filtros?: FiltrosVisita): Promise<RegistroVisita[]> {
    const response = await apiClient.get<RegistroVisita[]>('/visitas', {
      params: filtros,
    });

    return response.data || [];
  }

  /**
   * Obtiene los visitantes activos (sin hora de salida)
   */
  async obtenerVisitantesActivos(): Promise<RegistroVisita[]> {
    const visitas = await this.obtenerVisitas();
    return visitas.filter((v) => !v.hora_salida);
  }

  /**
   * Obtiene una visita específica
   */
  async obtenerVisita(id: number): Promise<RegistroVisita | null> {
    const response = await apiClient.get<RegistroVisita>(`/visitas/${id}`);
    return response.data || null;
  }

  /**
   * Busca visitas por nombre
   */
  async buscarPorNombre(nombre: string): Promise<RegistroVisita[]> {
    return this.obtenerVisitas({ nombre });
  }

  /**
   * Busca visitas por fecha
   */
  async buscarPorFecha(fecha: string): Promise<RegistroVisita[]> {
    return this.obtenerVisitas({ fecha });
  }

  /**
   * Busca visitas por despacho
   */
  async buscarPorDespacho(idDespacho: number): Promise<RegistroVisita[]> {
    return this.obtenerVisitas({ despacho: idDespacho });
  }
}

export const visitasService = new VisitasService();
export default visitasService;
