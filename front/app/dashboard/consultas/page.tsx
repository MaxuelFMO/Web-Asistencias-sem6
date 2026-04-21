'use client';

import DashboardLayout from '@/components/DashboardLayout';
import ConsultasView from '@/views/ConsultasView';

export default function ConsultasPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Consultas</h2>
          <p className="text-muted-foreground">Busca y consulta registros de visitas</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8">
          <ConsultasView />
        </div>
      </div>
    </DashboardLayout>
  );
}
