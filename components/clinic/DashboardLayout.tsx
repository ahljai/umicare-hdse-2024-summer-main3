"use client";

import React, { ReactNode } from 'react';
import Navigation from './Navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navigation />
      <main className="flex flex-col space-y-8 p-6 max-w-6xl mx-auto">
        {children}
      </main>
      <footer className="text-center text-gray-500 text-sm mt-8">
        <p>© 2024 Your Clinic. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DashboardLayout;
