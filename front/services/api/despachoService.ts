/**
 * Despacho Service - Gestiona los despachos y personas
 */

import apiClient from './client';

export interface Despacho {
  id: number;
  nombre: string;
}

export interface Persona {
  id?: number;
  nombre: string;
  despacho_id: number;
  cargo?: string;
}

class DespachoService {
  /**
   * Obtiene lista de todos los despachos
   */
  async obtenerDespachos(): Promise<Despacho[]> {
    const response = await apiClient.get<Despacho[]>('/despachos');
    return response.data || [];
  }

  /**
   * Obtiene un despacho específico
   */
  async obtenerDespacho(id: number): Promise<Despacho | null> {
    const response = await apiClient.get<Despacho>(`/despachos/${id}`);
    return response.data || null;
  }

  /**
   * Obtiene las personas de un despacho
   */
  async obtenerPersonasDespacho(despachoId: number): Promise<Persona[]> {
    const response = await apiClient.get<Persona[]>(
      `/despachos/${despachoId}/personas`
    );
    return response.data || [];
  }

  /**
   * Crea un nuevo despacho
   */
  async crearDespacho(nombre: string): Promise<any> {
    return apiClient.post('/despachos', {
      data: { nombre },
    });
  }

  /**
   * Actualiza un despacho
   */
  async actualizarDespacho(id: number, nombre: string): Promise<any> {
    return apiClient.put(`/despachos/${id}`, {
      data: { nombre },
    });
  }

  /**
   * Elimina un despacho
   */
  async eliminarDespacho(id: number): Promise<any> {
    return apiClient.delete(`/despachos/${id}`);
  }
}

export const despachoService = new DespachoService();
export default despachoService;
