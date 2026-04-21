/**
 * Reporte Controller - Lógica de negocio para reportes y estadísticas
 */

import {
  reporteService,
  ReporteDia,
  ReporteDespacho,
  TiempoPromedio,
  EstadisticasGenerales,
} from '@/services/api';

export interface ReporteState {
  estadisticas: EstadisticasGenerales | null;
  visitasPorDia: ReporteDia[];
  visitasPorDespacho: ReporteDespacho[];
  tiempoPromedio: TiempoPromedio[];
  isLoading: boolean;
  error: string | null;
}

export const initialReporteState: ReporteState = {
  estadisticas: null,
  visitasPorDia: [],
  visitasPorDespacho: [],
  tiempoPromedio: [],
  isLoading: false,
  error: null,
};

export class ReporteController {
  /**
   * Obtiene las estadísticas generales
   */
  static async obtenerEstadisticasGenerales(): Promise<EstadisticasGenerales | null> {
    try {
      return await reporteService.obtenerEstadisticasGenerales();
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return null;
    }
  }

  /**
   * Obtiene las visitas por día
   */
  static async obtenerVisitasPorDia(
    fecha_inicio?: string,
    fecha_fin?: string
  ): Promise<ReporteDia[]> {
    try {
      return await reporteService.obtenerVisitasPorDia(fecha_inicio, fecha_fin);
    } catch (error) {
      console.error('Error obteniendo visitas por día:', error);
      return [];
    }
  }

  /**
   * Obtiene las visitas por despacho
   */
  static async obtenerVisitasPorDespacho(
    fecha_inicio?: string,
    fecha_fin?: string
  ): Promise<ReporteDespacho[]> {
    try {
      return await reporteService.obtenerVisitasPorDespacho(
        fecha_inicio,
        fecha_fin
      );
    } catch (error) {
      console.error('Error obteniendo visitas por despacho:', error);
      return [];
    }
  }

  /**
   * Obtiene el tiempo promedio de permanencia
   */
  static async obtenerTiempoPromedio(
    fecha_inicio?: string,
    fecha_fin?: string
  ): Promise<TiempoPromedio[]> {
    try {
      return await reporteService.obtenerTiempoPromedio(fecha_inicio, fecha_fin);
    } catch (error) {
      console.error('Error obteniendo tiempo promedio:', error);
      return [];
    }
  }

  /**
   * Obtiene todos los reportes
   */
  static async obtenerTodosReportes(
    fecha_inicio?: string,
    fecha_fin?: string
  ): Promise<ReporteState> {
    try {
      const [estadisticas, visitasPorDia, visitasPorDespacho, tiempoPromedio] =
        await Promise.all([
          reporteService.obtenerEstadisticasGenerales(),
          reporteService.obtenerVisitasPorDia(fecha_inicio, fecha_fin),
          reporteService.obtenerVisitasPorDespacho(fecha_inicio, fecha_fin),
          reporteService.obtenerTiempoPromedio(fecha_inicio, fecha_fin),
        ]);

      return {
        estadisticas: estadisticas || null,
        visitasPorDia,
        visitasPorDespacho,
        tiempoPromedio,
        isLoading: false,
        error: null,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      return {
        ...initialReporteState,
        error: errorMessage,
      };
    }
  }

  /**
   * Descarga Excel
   */
  static async descargarExcel(
    fecha_inicio?: string,
    fecha_fin?: string,
    onError?: (error: string) => void
  ): Promise<void> {
    try {
      await reporteService.descargarExcel(fecha_inicio, fecha_fin);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al descargar Excel';
      onError?.(errorMessage);
    }
  }

  /**
   * Descarga CSV
   */
  static async descargarCSV(
    fecha_inicio?: string,
    fecha_fin?: string,
    onError?: (error: string) => void
  ): Promise<void> {
    try {
      await reporteService.descargarCSV(fecha_inicio, fecha_fin);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al descargar CSV';
      onError?.(errorMessage);
    }
  }

  /**
   * Valida el rango de fechas
   */
  static validateFechas(
    fecha_inicio?: string,
    fecha_fin?: string
  ): string | null {
    if (!fecha_inicio && !fecha_fin) {
      return null;
    }

    if (fecha_inicio && fecha_fin) {
      const inicio = new Date(fecha_inicio);
      const fin = new Date(fecha_fin);

      if (inicio > fin) {
        return 'La fecha de inicio no puede ser mayor que la fecha final';
      }
    }

    return null;
  }

  /**
   * Formatea los datos para gráficos
   */
  static formatearDatosGrafico(
    data: ReporteDia[] | ReporteDespacho[]
  ): any[] {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data.map((item: any) => ({
      name: item.fecha || item.despacho,
      value: item.cantidad,
      porcentaje: (item as any).porcentaje,
    }));
  }
}

export default ReporteController;
