'use client';

import { useState, useEffect } from 'react';
import ReporteController from '@/controllers/reporteController';
import { EstadisticasGenerales, ReporteDia, ReporteDespacho } from '@/services/api';

export default function ReportesView() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasGenerales | null>(
    null
  );
  const [visitasPorDia, setVisitasPorDia] = useState<ReporteDia[]>([]);
  const [visitasPorDespacho, setVisitasPorDespacho] = useState<ReporteDespacho[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Filtros
  const [filtros, setFiltros] = useState({
    fecha_inicio: '',
    fecha_fin: '',
  });

  useEffect(() => {
    loadReportes();
  }, []);

  const loadReportes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const validationError = ReporteController.validateFechas(
        filtros.fecha_inicio,
        filtros.fecha_fin
      );

      if (validationError) {
        setError(validationError);
        setIsLoading(false);
        return;
      }

      const reportes = await ReporteController.obtenerTodosReportes(
        filtros.fecha_inicio,
        filtros.fecha_fin
      );

      if (reportes.error) {
        setError(reportes.error);
      } else {
        setEstadisticas(reportes.estadisticas);
        setVisitasPorDia(reportes.visitasPorDia);
        setVisitasPorDespacho(reportes.visitasPorDespacho);
      }
    } catch (err) {
      setError('Error al cargar los reportes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    loadReportes();
  };

  const handleExportarExcel = async () => {
    setIsExporting(true);
    try {
      await ReporteController.descargarExcel(
        filtros.fecha_inicio,
        filtros.fecha_fin,
        (error) => setError(error)
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportarCSV = async () => {
    setIsExporting(true);
    try {
      await ReporteController.descargarCSV(
        filtros.fecha_inicio,
        filtros.fecha_fin,
        (error) => setError(error)
      );
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-destructive text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Filtros</h2>

        <form onSubmit={handleBuscar} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Fecha Inicio
              </label>
              <input
                type="date"
                name="fecha_inicio"
                value={filtros.fecha_inicio}
                onChange={handleFiltroChange}
                className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Fecha Fin
              </label>
              <input
                type="date"
                name="fecha_fin"
                value={filtros.fecha_fin}
                onChange={handleFiltroChange}
                className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg transition"
            >
              Filtrar
            </button>

            <button
              type="button"
              onClick={handleExportarExcel}
              disabled={isExporting}
              className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold py-2 px-4 rounded-lg transition"
            >
              {isExporting ? 'Exportando...' : 'Exportar Excel'}
            </button>

            <button
              type="button"
              onClick={handleExportarCSV}
              disabled={isExporting}
              className="bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-accent-foreground font-semibold py-2 px-4 rounded-lg transition"
            >
              {isExporting ? 'Exportando...' : 'Exportar CSV'}
            </button>
          </div>
        </form>
      </div>

      {/* Estadísticas Generales */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
            <h3 className="text-muted-foreground text-sm font-medium mb-2">Visitas Hoy</h3>
            <p className="text-3xl font-bold text-primary">
              {estadisticas.visitas_hoy}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
            <h3 className="text-muted-foreground text-sm font-medium mb-2">Visitas Totales</h3>
            <p className="text-3xl font-bold text-primary">
              {estadisticas.visitas_totales}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors">
            <h3 className="text-muted-foreground text-sm font-medium mb-2">
              Visitantes Activos
            </h3>
            <p className="text-3xl font-bold text-accent">
              {estadisticas.visitantes_activos}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
            <h3 className="text-muted-foreground text-sm font-medium mb-2">
              Tiempo Promedio
            </h3>
            <p className="text-2xl font-bold text-primary">
              {estadisticas.tiempo_promedio_permanencia}
            </p>
          </div>
        </div>
      )}

      {/* Visitas por Día */}
      {visitasPorDia.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Visitas por Día</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-card border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">
                    Cantidad
                  </th>
                </tr>
              </thead>
              <tbody>
                {visitasPorDia.map((item) => (
                  <tr key={item.fecha} className="border-b border-border hover:bg-card/50">
                    <td className="px-4 py-3 text-foreground">{item.fecha}</td>
                    <td className="px-4 py-3 text-right text-foreground font-semibold">
                      {item.cantidad}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Visitas por Despacho */}
      {visitasPorDespacho.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Visitas por Despacho
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-card border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Despacho
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">
                    Cantidad
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">
                    Porcentaje
                  </th>
                </tr>
              </thead>
              <tbody>
                {visitasPorDespacho.map((item) => (
                  <tr key={item.despacho} className="border-b border-border hover:bg-card/50">
                    <td className="px-4 py-3 text-foreground">{item.despacho}</td>
                    <td className="px-4 py-3 text-right text-foreground font-semibold">
                      {item.cantidad}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {item.porcentaje.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
