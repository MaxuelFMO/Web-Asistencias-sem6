/**
 * Utilidades y funciones auxiliares
 */

/**
 * Formatea fecha a formato DD/MM/YYYY
 */
export const formatearFecha = (fecha: string | Date): string => {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Formatea hora a formato HH:MM
 */
export const formatearHora = (hora: string): string => {
  if (!hora) return '--:--';
  const [h, m] = hora.split(':');
  return `${h}:${m}`;
};

/**
 * Calcula diferencia de tiempo entre dos horas
 */
export const calcularDiferenciaTiempo = (
  horaEntrada: string,
  horaSalida: string
): string => {
  if (!horaEntrada || !horaSalida) return '--:--:--';

  try {
    const [hE, mE] = horaEntrada.split(':').map(Number);
    const [hS, mS] = horaSalida.split(':').map(Number);

    let horas = hS - hE;
    let minutos = mS - mE;

    if (minutos < 0) {
      horas--;
      minutos += 60;
    }

    const segundos = 0;

    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  } catch {
    return '--:--:--';
  }
};

/**
 * Valida formato de DNI
 */
export const validarDNI = (dni: string): boolean => {
  const dniLimpio = dni.replace(/\D/g, '');
  return /^\d{7,10}$/.test(dniLimpio);
};

/**
 * Valida email
 */
export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Limpia espacios en blanco
 */
export const limpiarEspacios = (texto: string): string => {
  return texto.trim().replace(/\s+/g, ' ');
};

/**
 * Capitaliza primera letra
 */
export const capitalizarPrimera = (texto: string): string => {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

/**
 * Capitaliza todas las palabras
 */
export const capitalizarPalabras = (texto: string): string => {
  return texto
    .split(' ')
    .map((palabra) => capitalizarPrimera(palabra))
    .join(' ');
};

/**
 * Formatea número como moneda
 */
export const formatearMoneda = (
  valor: number,
  moneda: string = 'USD'
): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: moneda,
  }).format(valor);
};

/**
 * Obtiene fecha actual en formato YYYY-MM-DD
 */
export const fechaHoy = (): string => {
  const hoy = new Date();
  return hoy.toISOString().split('T')[0];
};

/**
 * Obtiene hora actual en formato HH:MM
 */
export const horaAhora = (): string => {
  const ahora = new Date();
  return `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
};

/**
 * Descarga archivo
 */
export const descargarArchivo = (blob: Blob, nombreArchivo: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nombreArchivo;
  link.click();
  window.URL.revokeObjectURL(url);
};

/**
 * Pausa la ejecución
 */
export const esperar = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Valida rango de fechas
 */
export const validarRangoFechas = (
  fechaInicio: string,
  fechaFin: string
): boolean => {
  if (!fechaInicio || !fechaFin) return true;

  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  return inicio <= fin;
};

/**
 * Obtiene diferencia de días entre dos fechas
 */
export const diasEntre = (fecha1: string, fecha2: string): number => {
  const d1 = new Date(fecha1);
  const d2 = new Date(fecha2);
  const diferencia = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
};

/**
 * Copia texto al portapapeles
 */
export const copiarAlPortapapeles = async (texto: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
};

/**
 * Objeto vacío o null
 */
export const esVacio = (obj: any): boolean => {
  return (
    obj === null ||
    obj === undefined ||
    Object.keys(obj).length === 0 ||
    (Array.isArray(obj) && obj.length === 0)
  );
};

export default {
  formatearFecha,
  formatearHora,
  calcularDiferenciaTiempo,
  validarDNI,
  validarEmail,
  limpiarEspacios,
  capitalizarPrimera,
  capitalizarPalabras,
  formatearMoneda,
  fechaHoy,
  horaAhora,
  descargarArchivo,
  esperar,
  validarRangoFechas,
  diasEntre,
  copiarAlPortapapeles,
  esVacio,
};
