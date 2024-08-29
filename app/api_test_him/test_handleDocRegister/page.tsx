"use client";
import { useState } from 'react';
import React from 'react';

const TestDoctorRegisterAPI: React.FC = () => {
  const [response, setResponse] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRegister = async () => {
    const res = await fetch('/api2/handleDocRegister', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setResponse(data);
  };

  return (
    <div>
      <h2>Register Doctor</h2>
      <form>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="text" name="name" placeholder="Name" onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button type="button" onClick={handleRegister}>Register</button>
      </form>
      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestDoctorRegisterAPI;
