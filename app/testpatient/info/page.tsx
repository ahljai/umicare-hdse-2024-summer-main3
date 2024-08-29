"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const fetchCurrentDoctor = async () => {
  try {
    const response = await fetch('/api/doctor/me');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch doctor:', error);
    return null;
  }
};

const DoctorProfilePage: React.FC = () => {
  const [doctor, setDoctor] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorData = async () => {
      setLoading(true);
      const doctorData = await fetchCurrentDoctor();
      setDoctor(doctorData);
      setLoading(false);
    };

    fetchDoctorData();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 to-gray-300">
      <header className="bg-white shadow-md p-4 mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Doctor Profile</h1>
      </header>

      <main className="flex flex-col max-w-6xl mx-auto space-y-6">
        <section className="bg-white shadow-lg rounded-lg p-6">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : doctor ? (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{doctor.name}</h2>
              <p className="text-gray-600"><strong>Contact Number:</strong> {doctor.contactNumber}</p>
              <p className="text-gray-600"><strong>Email:</strong> {doctor.email}</p>
              {/* Add more fields as necessary */}
            </div>
          ) : (
            <div className="text-center text-gray-500">No doctor data found or you are not logged in.</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DoctorProfilePage;