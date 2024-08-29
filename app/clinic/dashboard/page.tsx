"use client";

import React from 'react';
import PatientSummary from '@/components/clinic/PatientSummary';
import AppointmentSchedule from '@/components/clinic/AppointmentSchedule';
import ClinicInfo from '@/components/clinic/ClinicInfo';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-100 to-blue-300">
      <header className="bg-white shadow-md p-4 mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Clinic Dashboard</h1>
        <p className="text-gray-600">Overview of patients, appointments, and clinic information.</p>
      </header>
      
      <main className="flex flex-wrap gap-6 max-w-6xl mx-auto">
        <div className="flex-1 min-w-[300px] bg-white shadow-lg rounded-lg p-6">
          <PatientSummary />
        </div>
        <div className="flex-1 min-w-[300px] bg-white shadow-lg rounded-lg p-6">
          <AppointmentSchedule />
        </div>
        <div className="flex-1 min-w-[300px] bg-white shadow-lg rounded-lg p-6">
          <ClinicInfo />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
//onyx