'use client';

import DashboardLayout from '@/components/DashboardLayout';
import ReportesView from '@/views/ReportesView';

export default function ReportesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Reportes</h2>
          <p className="text-muted-foreground">Estadísticas y análisis de visitas</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8">
          <ReportesView />
        </div>
      </div>
    </DashboardLayout>
  );
}
