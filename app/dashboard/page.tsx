'use client';

import DashboardLayout from '@/components/DashboardLayout';
import RegistroVisitaView from '@/views/RegistroVisitaView';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Bienvenido</h2>
          <p className="text-muted-foreground">Sistema de Control de Visitas</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Visitas Hoy</p>
                <p className="text-3xl font-bold text-foreground mt-2">0</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm">En Espera</p>
                <p className="text-3xl font-bold text-foreground mt-2">0</p>
              </div>
              <div className="p-3 rounded-lg bg-accent/10">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 6a3 3 0 11-6 0 3 3 0 016 0zM6 20a9 9 0 0118 0v2H6v-2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Salidas Hoy</p>
                <p className="text-3xl font-bold text-foreground mt-2">0</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Este Mes</p>
                <p className="text-3xl font-bold text-foreground mt-2">0</p>
              </div>
              <div className="p-3 rounded-lg bg-accent/10">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Registro Entrada Section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-bold text-foreground mb-6">Registro de Entrada Rápido</h3>
          <RegistroVisitaView />
        </div>
      </div>
    </DashboardLayout>
  );
}
