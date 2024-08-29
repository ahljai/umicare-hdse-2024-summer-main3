// locate: app/api_test_him/test_getPaitientListByDoc/page.tsx
//以doctor uid找出所有符合的病人 .....未測試
"use client";
import React, { useState, useEffect } from 'react';

interface User {
  email: string;
  phone: string;
  name: string;
  password: string;
  userType: string;
  doctor: string;
  clinic: string;
}

const PatientList: React.FC = () => {
  const [doctorId, setDoctorId] = useState<string>('');
  const [patients, setPatients] = useState<{ uid: string, user: User }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api2/getPatientListByDoc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doctor: doctorId }),
      });

      const data = await response.json();

      if (response.ok) {
        setPatients(data.users);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch patients');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPatients();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Doctor ID:
          <input
            type="text"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          />
        </label>
        <button type="submit">Search</button>
      </form>

      {error && <div>Error: {error}</div>}

      {patients.map(({ uid, user }) => (
        <div key={uid} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
          <h3>{user.name}</h3>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <p>Clinic: {user.clinic}</p>
        </div>
      ))}
    </div>
  );
};

export default PatientList;
