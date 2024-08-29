// locate: app/api_test_him/test_assignDoctorToPat.tsx
"use client";
import { useState } from 'react';
import React from 'react';

const AssignDoctorForm: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [doctor, setDoctor] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch('/api2/assignDoctorToPat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, doctor }),
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
          <label htmlFor="doctor">Doctor:</label>
          <input
            type="text"
            id="doctor"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default AssignDoctorForm;
