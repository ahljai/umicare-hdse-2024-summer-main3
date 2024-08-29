"use client";

import React from 'react';
import PatientSummary from '@/components/clinic/PatientSummary';
import TodayAppointmentSchedule from '@/components/clinic/TodayAppointmentSchedule';
import ClinicInfo from '@/components/clinic/ClinicInfo';
import DashboardLayout from '@/components/clinic/DashboardLayout';

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">Clinic Dashboard</h1>
        <p className="text-lg text-gray-700 mt-2">Overview of patients, appointments, and clinic information.</p>
      </header>
      
      <div className="flex flex-wrap gap-8 justify-between">
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 flex-1 min-w-[300px]">
          <PatientSummary />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 flex-1 min-w-[300px]">
          <TodayAppointmentSchedule />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 flex-1 min-w-[300px]">
          <ClinicInfo />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
