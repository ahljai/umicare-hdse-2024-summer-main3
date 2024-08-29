"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Simulating API calls
const fetchPatients = async (filter: string, doctorFilter: string) => {
  try {
    const response = await fetch(`/api/patients?filter=${filter}&doctor=${doctorFilter}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    return [];
  }
};

const fetchDoctors = async () => {
  try {
    const response = await fetch('/api/doctor');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch doctors:', error);
    return [];
  }
};

const createPatient = async (patient: { name: string; status: string; doctorId: string }) => {
  try {
    const response = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('Failed to create patient:', error);
    return null;
  }
};

const updatePatient = async (id: string, patient: { name: string; status: string; doctorId: string }) => {
  try {
    const response = await fetch(`/api/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('Failed to update patient:', error);
    return null;
  }
};

const deletePatient = async (id: string) => {
  try {
    const response = await fetch(`/api/patients/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('Failed to delete patient:', error);
    return null;
  }
};

const PatientsPage: React.FC = () => {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [newPatient, setNewPatient] = useState({ name: '', status: 'active', doctorId: '' });
  const [editPatient, setEditPatient] = useState({ name: '', status: 'active', doctorId: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      const patientData = await fetchPatients(filter, doctorFilter);
      setPatients(patientData);
      setLoading(false);
    };

    const fetchDoctorData = async () => {
      const doctorData = await fetchDoctors();
      setDoctors(doctorData);
    };

    fetchPatientData();
    fetchDoctorData();
  }, [filter, doctorFilter]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  const handleDoctorFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDoctorFilter(event.target.value);
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    const createdPatient = await createPatient(newPatient);
    if (createdPatient) {
      setPatients([...patients, createdPatient]);
      setNewPatient({ name: '', status: 'active', doctorId: '' });
      setShowModal(false);
    }
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editingPatient) {
      const updatedPatient = await updatePatient(editingPatient.id, editPatient);
      if (updatedPatient) {
        setPatients(patients.map(patient =>
          patient.id === updatedPatient.id ? updatedPatient : patient
        ));
        setEditingPatient(null);
        setEditPatient({ name: '', status: 'active', doctorId: '' });
        setShowModal(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const result = await deletePatient(id);
    if (result) {
      setPatients(patients.filter(patient => patient.id !== id));
      setDeletingId(null);
    }
  };

  const handleChatroom = (patientId: string) => {
    router.push(`/chatroom/${patientId}`);
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !filter || patient.status === filter;
    const matchesDoctor = !doctorFilter || patient.doctorId === doctorFilter;

    return matchesSearch && matchesStatus && matchesDoctor;
  });

  // Create a map of doctor IDs to doctor names
  const doctorMap = doctors.reduce((acc, doctor) => {
    acc[doctor.id] = doctor.name;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 to-gray-300">
      <header className="bg-white shadow-md p-4 mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Patients</h1>
      </header>
      
      <main className="flex flex-col max-w-6xl mx-auto space-y-6">
        {/* Button to open modal */}
        <button
          onClick={() => {
            setNewPatient({ name: '', status: 'active', doctorId: '' });
            setEditingPatient(null);
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6"
        >
          Add Patient
        </button>

        {/* Patient Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {editingPatient ? 'Edit Patient' : 'Create New Patient'}
              </h2>
              <form onSubmit={editingPatient ? handleUpdate : handleCreate} className="space-y-4">
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={editingPatient ? editPatient.name : newPatient.name}
                  onChange={e => editingPatient ? setEditPatient({ ...editPatient, name: e.target.value }) : setNewPatient({ ...newPatient, name: e.target.value })}
                  className="p-2 border rounded w-full"
                  required
                />
                <select
                  value={editingPatient ? editPatient.status : newPatient.status}
                  onChange={e => editingPatient ? setEditPatient({ ...editPatient, status: e.target.value }) : setNewPatient({ ...newPatient, status: e.target.value })}
                  className="p-2 border rounded w-full"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select
                  value={editingPatient ? editPatient.doctorId : newPatient.doctorId}
                  onChange={e => editingPatient ? setEditPatient({ ...editPatient, doctorId: e.target.value }) : setNewPatient({ ...newPatient, doctorId: e.target.value })}
                  className="p-2 border rounded w-full"
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                  ))}
                </select>
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    {editingPatient ? 'Update Patient' : 'Add Patient'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Patients List */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-6">
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={handleSearch}
              className="p-2 border rounded w-full"
            />
            <select
              value={filter}
              onChange={handleFilter}
              className="p-2 border rounded"
            >
              <option value="">All Patients</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={doctorFilter}
              onChange={handleDoctorFilter}
              className="p-2 border rounded"
            >
              <option value="">All Doctors</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <ul>
              {filteredPatients.length === 0 ? (
                <li className="text-center text-gray-500">No patients found</li>
              ) : (
                filteredPatients.map(patient => (
                  <li key={patient.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">{patient.name}</h2>
                    <p className="text-gray-600">ID: {patient.id}</p>
                    <p className="text-gray-600">Status: {patient.status}</p>
                    <p className="text-gray-600">Doctor: {doctorMap[patient.doctorId] || 'Unknown'}</p>
                    <div className="flex space-x-4 mt-4">
                      <button
                        onClick={() => handleEdit(patient)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleChatroom(patient.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Chatroom
                      </button>
                      <button
                        onClick={() => handleDelete(patient.id)}
                        disabled={deletingId === patient.id}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        {deletingId === patient.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default PatientsPage;
