'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-sidebar-border border-t-primary animate-spin"></div>
          <p className="text-sidebar-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 transition-all duration-300 lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Control de Visitas</h1>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-accent-foreground">
                <Person size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
