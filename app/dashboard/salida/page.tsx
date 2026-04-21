'use client';

import DashboardLayout from '@/components/DashboardLayout';
import SalidaVisitaView from '@/views/SalidaVisitaView';

export default function SalidaPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Registrar Salida</h2>
          <p className="text-muted-foreground">Registra la salida de visitantes</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8">
          <SalidaVisitaView />
        </div>
      </div>
    </DashboardLayout>
  );
}
