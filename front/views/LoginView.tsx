'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthController from '@/controllers/authController';

export default function LoginView() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar credenciales
    const validationError = AuthController.validateCredentials(usuario, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const result = await AuthController.handleLogin(
        { usuario, password },
        () => {
          router.push('/dashboard');
        },
        (error) => {
          setError(error);
        }
      );

      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Card */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <span className="text-2xl font-bold text-accent-foreground">CV</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Control de Visitas</h1>
          <p className="text-muted-foreground">Iniciar sesión en el sistema</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-destructive text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 bg-card rounded-lg border border-border p-8 shadow-lg">
          {/* Usuario Input */}
          <div>
            <label htmlFor="usuario" className="block text-sm font-medium text-foreground mb-2">
              Usuario
            </label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              disabled={isLoading}
              placeholder="admin"
              className="w-full px-4 py-2.5 border border-input rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-input rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2 mt-6"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Cargando...
              </>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-muted-foreground text-xs">
          <p>Sistema de Control de Visitas © 2026</p>
          <p className="mt-2">Usa admin/admin para pruebas</p>
        </div>
      </div>
    </div>
  );
}
