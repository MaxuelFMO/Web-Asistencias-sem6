'use client';

import { useState, useEffect } from 'react';
import VisitasController, { RegistroEntrada } from '@/controllers/visitasController';
import { despachoService, Despacho } from '@/services/api';

export default function RegistroVisitaView() {
  const [formData, setFormData] = useState<RegistroEntrada>({
    nombre: '',
    dni: '',
    persona_visitada: '',
    id_despacho: 0,
  });

  const [despachos, setDespachos] = useState<Despacho[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDespachos, setIsLoadingDespachos] = useState(true);

  // Cargar despachos al montar el componente
  useEffect(() => {
    loadDespachos();
  }, []);

  const loadDespachos = async () => {
    try {
      const data = await despachoService.obtenerDespachos();
      setDespachos(data);
    } catch (err) {
      setError('Error al cargar los despachos');
    } finally {
      setIsLoadingDespachos(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'id_despacho' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await VisitasController.registrarEntrada(
        formData,
        (visita) => {
          setSuccess('Visita registrada exitosamente');
          setFormData(VisitasController.limpiarFormulario());
          setTimeout(() => setSuccess(null), 3000);
        },
        (error) => {
          setError(error);
        }
      );
    } catch (err) {
      setError('Error al registrar la visita');
    } finally {
      setIsLoading(false);
    }
  };

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

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Juan Pérez"
              required
              className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition disabled:opacity-50"
            />
          </div>

          {/* DNI */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              DNI
            </label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="12345678"
              required
              className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition disabled:opacity-50"
            />
          </div>

          {/* Persona Visitada */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Persona a Visitar
            </label>
            <input
              type="text"
              name="persona_visitada"
              value={formData.persona_visitada}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Nombre del directivo"
              required
              className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition disabled:opacity-50"
            />
          </div>

          {/* Despacho */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Despacho
            </label>
            <select
              name="id_despacho"
              value={formData.id_despacho}
              onChange={handleChange}
              disabled={isLoading || isLoadingDespachos}
              required
              className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition disabled:opacity-50"
            >
              <option value={0}>Seleccione un despacho</option>
              {despachos.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || isLoadingDespachos}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Registrando...
              </>
            ) : (
              'Registrar Entrada'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
