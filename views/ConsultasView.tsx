'use client';

import { useState } from 'react';
import VisitasController, { RegistroVisita } from '@/controllers/visitasController';
import { despachoService, Despacho } from '@/services/api';

export default function ConsultasView() {
  const [resultados, setResultados] = useState<RegistroVisita[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [despachos, setDespachos] = useState<Despacho[]>([]);

  // Filtros
  const [filtros, setFiltros] = useState({
    nombre: '',
    fecha: '',
    despacho: '',
  });

  // Cargar despachos al montar
  const loadDespachos = async () => {
    try {
      const data = await despachoService.obtenerDespachos();
      setDespachos(data);
    } catch (err) {
      console.error('Error cargando despachos');
    }
  };

  useState(() => {
    loadDespachos();
  });

  const handleFiltroChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let datos: RegistroVisita[] = [];

      if (filtros.nombre) {
        datos = await VisitasController.buscarPorNombre(filtros.nombre);
      } else if (filtros.fecha) {
        datos = await VisitasController.buscarPorFecha(filtros.fecha);
      } else if (filtros.despacho) {
        datos = await VisitasController.buscarPorDespacho(
          parseInt(filtros.despacho)
        );
      } else {
        datos = await VisitasController.obtenerVisitas();
      }

      setResultados(datos);
    } catch (err) {
      setError('Error al buscar registros');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLimpiar = () => {
    setFiltros({ nombre: '', fecha: '', despacho: '' });
    setResultados([]);
  };

  return (
    <div>
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-destructive text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Filtros */}
      <form onSubmit={handleBuscar} className="mb-6 p-5 bg-card border border-border rounded-lg">
        <h3 className="font-semibold text-foreground mb-4">Filtros</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={filtros.nombre}
              onChange={handleFiltroChange}
              placeholder="Buscar por nombre"
              className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Fecha
            </label>
            <input
              type="date"
              name="fecha"
              value={filtros.fecha}
              onChange={handleFiltroChange}
              className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          {/* Despacho */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Despacho
            </label>
            <select
              name="despacho"
              value={filtros.despacho}
              onChange={handleFiltroChange}
              className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">Todos los despachos</option>
              {despachos.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 mt-5">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold py-2 px-4 rounded-lg transition"
          >
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
          <button
            type="button"
            onClick={handleLimpiar}
            className="bg-muted hover:bg-muted/90 text-muted-foreground font-semibold py-2 px-4 rounded-lg transition"
          >
            Limpiar
          </button>
        </div>
      </form>

      {/* Resultados */}
      {resultados.length === 0 && !isLoading && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            {Object.values(filtros).every((v) => !v)
              ? 'Utilice los filtros para buscar registros'
              : 'No se encontraron resultados'}
          </p>
        </div>
      )}

      {resultados.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-4">
            Resultados: {resultados.length} registros
          </h3>
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
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Entrada
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Salida
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Tiempo
                  </th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((registro) => (
                  <tr
                    key={registro.id}
                    className="border-b border-border hover:bg-card/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-foreground">{registro.nombre}</td>
                    <td className="px-4 py-3 text-muted-foreground">{registro.dni}</td>
                    <td className="px-4 py-3 text-foreground">
                      {registro.persona_visitada}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{registro.fecha}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {registro.hora_entrada || '--:--'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {registro.hora_salida || '--:--'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {registro.tiempo || '--:--:--'}
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
