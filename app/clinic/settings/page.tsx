"use client";

import React, { useState, useEffect } from 'react';

const ClinicHostSettingsPage: React.FC = () => {
  const [clinicName, setClinicName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [operatingHours, setOperatingHours] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/clinic/settings');
        if (response.ok) {
          const data = await response.json();
          setClinicName(data.clinicName || '');
          setAddress(data.address || '');
          setPhone(data.phone || '');
          setEmail(data.email || '');
          setOperatingHours(data.operatingHours || '');
        } else {
          console.error('Failed to fetch settings');
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    const settings = { clinicName, address, phone, email, operatingHours };
    try {
      const response = await fetch('/api/clinic/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        alert('Settings saved!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 to-gray-300">
      <header className="bg-white shadow-md p-4 mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Clinic Host Settings</h1>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Clinic Information</h2>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Clinic Name</label>
            <input
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Operating Hours</label>
            <input
              type="text"
              value={operatingHours}
              onChange={(e) => setOperatingHours(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Save Settings
          </button>
        </div>
      </section>
    </div>
  );
};

export default ClinicHostSettingsPage;
//onyx