"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const Navigation: React.FC = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Clinic Dashboard</h1>
        <nav className="space-x-4">
          <button onClick={() => navigateTo('/clinic/dashboard')} className="text-blue-500 hover:underline">Dashboard</button>
          <button onClick={() => navigateTo('/clinic/patients')} className="text-blue-500 hover:underline">Patients</button>
          <button onClick={() => navigateTo('/clinic/appointments')} className="text-blue-500 hover:underline">Appointments</button>
          <button onClick={() => navigateTo('/clinic/settings')} className="text-blue-500 hover:underline">Settings</button>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
