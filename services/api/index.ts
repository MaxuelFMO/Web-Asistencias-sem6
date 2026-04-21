/**
 * API Services Index
 * Exporta todos los servicios de API de forma centralizada
 */

export { apiClient, default as APIClient } from './client';
export { authService, default as AuthService } from './authService';
export { visitasService, default as VisitasService } from './visitasService';
export { despachoService, default as DespachoService } from './despachoService';
export { reporteService, default as ReporteService } from './reporteService';

// Tipos
export type { LoginRequest, LoginResponse, User } from './authService';
export type {
  RegistroVisita,
  RegistroEntrada,
  FiltrosVisita,
} from './visitasService';
export type { Despacho, Persona } from './despachoService';
export type {
  ReporteDia,
  ReporteDespacho,
  TiempoPromedio,
  EstadisticasGenerales,
} from './reporteService';
