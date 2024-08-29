// locate: app/api_test_him/test_assignClinicToPat.tsx
"use client";
import { useState } from 'react';
import React from 'react';

const AssignClinicForm: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [clinic, setClinic] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch('/api2/assignClinicToPat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, clinic }),
    });

    const data = await response.json();
    if (response.ok) {
      setResponseMessage(`User updated successfully: ${JSON.stringify(data.user)}`);
    } else {
      setResponseMessage(`Error: ${data.error}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userId">User ID:</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="clinic">Clinic:</label>
          <input
            type="text"
            id="clinic"
            value={clinic}
            onChange={(e) => setClinic(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default AssignClinicForm;
