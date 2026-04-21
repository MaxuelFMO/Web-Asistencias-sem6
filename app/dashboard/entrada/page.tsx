'use client';

import DashboardLayout from '@/components/DashboardLayout';
import RegistroVisitaView from '@/views/RegistroVisitaView';

export default function EntradaPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Registrar Entrada</h2>
          <p className="text-muted-foreground">Registra el acceso de nuevos visitantes</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8">
          <RegistroVisitaView />
        </div>
      </div>
    </DashboardLayout>
  );
}
