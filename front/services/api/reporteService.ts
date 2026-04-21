/**
 * Reporte Service - Gestiona reportes y estadísticas
 */

import apiClient from './client';

export interface ReporteDia {
  fecha: string;
  cantidad: number;
}

export interface ReporteDespacho {
  despacho: string;
  cantidad: number;
  porcentaje: number;
}

export interface TiempoPromedio {
  despacho?: string;
  tiempo_promedio: string;
  visitas_totales: number;
}

export interface EstadisticasGenerales {
  visitas_hoy: number;
  visitas_totales: number;
  visitantes_activos: number;
  tiempo_promedio_permanencia: string;
}

class ReporteService {
  /**
   * Obtiene visitas por día
   */
  async obtenerVisitasPorDia(
    fecha_inicio?: string,
    fecha_fin?: string
  ): Promise<ReporteDia[]> {
    const response = await apiClient.get<ReporteDia[]>(
      '/reportes/visitas-dia',
      {
        params: {
          fecha_inicio,
          fecha_fin,
        },
      }
    );
    return response.data || [];
  }

  /**
   * Obtiene visitas por despacho
   */
  async obtenerVisitasPorDespacho(
    fecha_inicio?: string,
    fecha_fin?: string
  ): Promise<ReporteDespacho[]> {
    const response = await apiClient.get<ReporteDespacho[]>(
      '/reportes/visitas-despacho',
      {
        params: {
          fecha_inicio,
          fecha_fin,
        },
      }
    );
    return response.data || [];
  }

  /**
   * Obtiene tiempo promedio de permanencia
   */
  async obtenerTiempoPromedio(
    fecha_inicio?: string,
    fecha_fin?: string
  ): Promise<TiempoPromedio[]> {
    const response = await apiClient.get<TiempoPromedio[]>(
      '/reportes/tiempo-promedio',
      {
        params: {
          fecha_inicio,
          fecha_fin,
        },
      }
    );
    return response.data || [];
  }

  /**
   * Obtiene estadísticas generales
   */
  async obtenerEstadisticasGenerales(): Promise<EstadisticasGenerales | null> {
    const response = await apiClient.get<EstadisticasGenerales>(
      '/reportes/estadisticas'
    );
    return response.data || null;
  }

  /**
   * Exporta datos a Excel
   */
  async exportarExcel(
    fecha_inicio?: string,
    fecha_fin?: string
  ): Promise<Blob> {
    const params = new URLSearchParams();
    if (fecha_inicio) params.append('fecha_inicio', fecha_inicio);
    if (fecha_fin) params.append('fecha_fin', fecha_fin);

    const url = `${apiClient.getBaseUrl()}/export/excel${params.toString() ? '?' + params.toString() : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiClient.getToken()}`,
      },
    });

    return response.blob();
  }

  /**
   * Exporta datos a CSV
   */
  async exportarCSV(
    fecha_inicio?: string,
    fecha_fin?: string
  ): Promise<Blob> {
    const params = new URLSearchParams();
    if (fecha_inicio) params.append('fecha_inicio', fecha_inicio);
    if (fecha_fin) params.append('fecha_fin', fecha_fin);

    const url = `${apiClient.getBaseUrl()}/export/csv${params.toString() ? '?' + params.toString() : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiClient.getToken()}`,
      },
    });

    return response.blob();
  }

  /**
   * Descarga un archivo
   */
  private descargarArchivo(blob: Blob, nombre: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombre;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Exporta a Excel y descarga
   */
  async descargarExcel(
    fecha_inicio?: string,
    fecha_fin?: string
  ): Promise<void> {
    const blob = await this.exportarExcel(fecha_inicio, fecha_fin);
    const fecha = new Date().toISOString().split('T')[0];
    this.descargarArchivo(blob, `visitas_${fecha}.xlsx`);
  }

  /**
   * Exporta a CSV y descarga
   */
  async descargarCSV(
    fecha_inicio?: string,
    fecha_fin?: string
  ): Promise<void> {
    const blob = await this.exportarCSV(fecha_inicio, fecha_fin);
    const fecha = new Date().toISOString().split('T')[0];
    this.descargarArchivo(blob, `visitas_${fecha}.csv`);
  }
}

export const reporteService = new ReporteService();
export default reporteService;
