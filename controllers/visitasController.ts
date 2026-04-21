/**
 * Visitas Controller - Lógica de negocio para gestión de visitas
 */

import {
  visitasService,
  RegistroVisita,
  RegistroEntrada,
  FiltrosVisita,
} from '@/services/api';

export interface VisitasState {
  visitas: RegistroVisita[];
  visitantesActivos: RegistroVisita[];
  isLoading: boolean;
  error: string | null;
}

export const initialVisitasState: VisitasState = {
  visitas: [],
  visitantesActivos: [],
  isLoading: false,
  error: null,
};

export class VisitasController {
  /**
   * Valida los datos de entrada
   */
  static validateEntrada(data: RegistroEntrada): string | null {
    if (!data.nombre || data.nombre.trim().length === 0) {
      return 'El nombre es requerido';
    }

    if (!data.dni || data.dni.trim().length === 0) {
      return 'El DNI es requerido';
    }

    if (!data.persona_visitada || data.persona_visitada.trim().length === 0) {
      return 'La persona a visitar es requerida';
    }

    if (!data.id_despacho || data.id_despacho <= 0) {
      return 'El despacho es requerido';
    }

    const dniRegex = /^\d{7,10}$/;
    if (!dniRegex.test(data.dni.replace(/\D/g, ''))) {
      return 'El DNI debe tener entre 7 y 10 dígitos';
    }

    return null;
  }

  /**
   * Registra una nueva entrada
   */
  static async registrarEntrada(
    data: RegistroEntrada,
    onSuccess?: (visita: RegistroVisita) => void,
    onError?: (error: string) => void
  ): Promise<VisitasState> {
    const validationError = this.validateEntrada(data);
    if (validationError) {
      onError?.(validationError);
      return {
        ...initialVisitasState,
        error: validationError,
      };
    }

    try {
      const response = await visitasService.registrarEntrada(data);

      if (response.status === 'ok') {
        onSuccess?.(response.data);
        return {
          ...initialVisitasState,
        };
      }

      const error = response.mensaje || 'Error al registrar entrada';
      onError?.(error);
      return {
        ...initialVisitasState,
        error,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      onError?.(errorMessage);
      return {
        ...initialVisitasState,
        error: errorMessage,
      };
    }
  }

  /**
   * Registra la salida de un visitante
   */
  static async registrarSalida(
    id: number,
    onSuccess?: (visita: RegistroVisita) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    try {
      const response = await visitasService.registrarSalida(id);

      if (response.status === 'ok') {
        onSuccess?.(response.data);
      } else {
        const error = response.mensaje || 'Error al registrar salida';
        onError?.(error);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      onError?.(errorMessage);
    }
  }

  /**
   * Obtiene todas las visitas
   */
  static async obtenerVisitas(
    filtros?: FiltrosVisita
  ): Promise<RegistroVisita[]> {
    try {
      return await visitasService.obtenerVisitas(filtros);
    } catch (error) {
      console.error('Error obteniendo visitas:', error);
      return [];
    }
  }

  /**
   * Obtiene visitantes activos
   */
  static async obtenerVisitantesActivos(): Promise<RegistroVisita[]> {
    try {
      return await visitasService.obtenerVisitantesActivos();
    } catch (error) {
      console.error('Error obteniendo visitantes activos:', error);
      return [];
    }
  }

  /**
   * Busca visitas por nombre
   */
  static async buscarPorNombre(nombre: string): Promise<RegistroVisita[]> {
    if (!nombre || nombre.trim().length === 0) {
      return [];
    }

    try {
      return await visitasService.buscarPorNombre(nombre.trim());
    } catch (error) {
      console.error('Error buscando por nombre:', error);
      return [];
    }
  }

  /**
   * Busca visitas por fecha
   */
  static async buscarPorFecha(fecha: string): Promise<RegistroVisita[]> {
    if (!fecha) {
      return [];
    }

    try {
      return await visitasService.buscarPorFecha(fecha);
    } catch (error) {
      console.error('Error buscando por fecha:', error);
      return [];
    }
  }

  /**
   * Busca visitas por despacho
   */
  static async buscarPorDespacho(idDespacho: number): Promise<RegistroVisita[]> {
    if (!idDespacho || idDespacho <= 0) {
      return [];
    }

    try {
      return await visitasService.buscarPorDespacho(idDespacho);
    } catch (error) {
      console.error('Error buscando por despacho:', error);
      return [];
    }
  }

  /**
   * Formatea el tiempo de permanencia
   */
  static formatearTiempo(tiempo: string): string {
    if (!tiempo) return '--:--:--';
    return tiempo;
  }

  /**
   * Limpia los datos del formulario
   */
  static limpiarFormulario(): RegistroEntrada {
    return {
      nombre: '',
      dni: '',
      persona_visitada: '',
      id_despacho: 0,
    };
  }
}

export default VisitasController;
