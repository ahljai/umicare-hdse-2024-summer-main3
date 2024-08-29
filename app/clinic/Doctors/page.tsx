"use client";
import { useState, useEffect } from 'react';

interface Doctor {
  id?: string;
  name: string;
  contactNumber?: string;
}

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const response = await fetch('/api/doctor');
    const data = await response.json();
    setDoctors(data);
  };

  const handleSubmit = async () => {
    const payload: Doctor = { name, contactNumber };
    const method = editId ? 'PUT' : 'POST';
    if (editId) payload.id = editId;

    await fetch(`/api/doctor`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    setName('');
    setContactNumber('');
    setEditId(null);
    fetchDoctors();
  };

  const handleEdit = (doctor: Doctor) => {
    setName(doctor.name);
    setContactNumber(doctor.contactNumber || '');
    setEditId(doctor.id || null);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/doctor/${id}`, { method: 'DELETE' });
    fetchDoctors();
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 to-gray-300">
      <header className="bg-white shadow-md p-4 mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Doctors Management</h1>
      </header>
      
      <main className="flex flex-col max-w-6xl mx-auto space-y-6">
        {/* Form to Add or Edit Doctor */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{editId ? 'Edit Doctor' : 'Add Doctor'}</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="p-2 border rounded w-full"
            />
            <div className="flex justify-between">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {editId ? 'Update' : 'Add'}
              </button>
              {editId && (
                <button
                  onClick={() => {
                    setName('');
                    setContactNumber('');
                    setEditId(null);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Doctors List */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Doctors List</h2>
          <ul>
            {doctors.length === 0 ? (
              <li className="text-center text-gray-500">No doctors found</li>
            ) : (
              doctors.map((doctor) => (
                <li key={doctor.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">{doctor.name}</h2>
                  <p className="text-gray-600">Contact: {doctor.contactNumber || 'No contact number'}</p>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleEdit(doctor)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(doctor.id || '')}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default DoctorsPage;
//onyx