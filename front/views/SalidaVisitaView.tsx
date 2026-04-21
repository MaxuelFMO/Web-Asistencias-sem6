'use client';

import { useState, useEffect } from 'react';
import VisitasController, { RegistroVisita } from '@/controllers/visitasController';

export default function SalidaVisitaView() {
  const [visitantesActivos, setVisitantesActivos] = useState<RegistroVisita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  // Cargar visitantes activos
  useEffect(() => {
    loadVisitantesActivos();
    // Recargar cada 30 segundos
    const interval = setInterval(loadVisitantesActivos, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadVisitantesActivos = async () => {
    try {
      const data = await VisitasController.obtenerVisitantesActivos();
      setVisitantesActivos(data);
    } catch (err) {
      setError('Error al cargar visitantes activos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrarSalida = async (id: number) => {
    setLoadingId(id);
    setError(null);

    try {
      await VisitasController.registrarSalida(
        id,
        () => {
          setSuccess('Salida registrada exitosamente');
          setVisitantesActivos(visitantesActivos.filter((v) => v.id !== id));
          setTimeout(() => setSuccess(null), 3000);
        },
        (error) => {
          setError(error);
        }
      );
    } catch (err) {
      setError('Error al registrar la salida');
    } finally {
      setLoadingId(null);
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
    <div>
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-destructive text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary rounded-lg">
          <p className="text-primary text-sm font-medium">{success}</p>
        </div>
      )}

      {/* Empty State */}
      {visitantesActivos.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground text-lg">
            No hay visitantes activos en el sistema
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-card border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  DNI
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Persona Visitada
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Entrada
                </th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {visitantesActivos.map((visitante) => (
                <tr
                  key={visitante.id}
                  className="border-b border-border hover:bg-card/50 transition-colors"
                >
                  <td className="px-4 py-3 text-foreground">{visitante.nombre}</td>
                  <td className="px-4 py-3 text-muted-foreground">{visitante.dni}</td>
                  <td className="px-4 py-3 text-foreground">
                    {visitante.persona_visitada}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {visitante.hora_entrada || '--:--'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleRegistrarSalida(visitante.id!)}
                      disabled={loadingId === visitante.id}
                      className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold py-1.5 px-3 rounded text-xs transition"
                    >
                      {loadingId === visitante.id ? 'Registrando...' : 'Salida'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={loadVisitantesActivos}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg transition"
        >
          Actualizar Lista
        </button>
      </div>
    </div>
  );
}
