"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getChat } from "@/app/actions";

// Fetch patients list by doctor ID
async function fetchPatients(doctor: string) {
  try {
    const response = await fetch('/api2/getPatientListByDoc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ doctor }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    throw error;
  }
}

// Fetch doctor details by email
async function fetchDoctors(email: string) {
  try {
    const response = await fetch('/api2/getUserDetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return [data.user] || [];
  } catch (error) {
    console.error('Failed to fetch doctors:', error);
    throw error;
  }
}

// Assign a doctor to a patient
const assignDoctor = async (
  userId: string,
  doctor: string,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const response = await fetch("/api2/assignDoctorToPat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, doctor }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    setError("Failed to assign doctor. Please try again later.");
    console.error("Failed to assign doctor:", error);
    return null;
  }
};

// Create a new patient
const createPatient = async (
  patient: { name: string; status: string; doctorId: string },
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const response = await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patient),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    setError("Failed to create patient. Please try again later.");
    console.error("Failed to create patient:", error);
    return null;
  }
};

// Delete a patient
const deletePatient = async (
  id: string,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const response = await fetch(`/api/patients/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    setError("Failed to delete patient. Please try again later.");
    console.error("Failed to delete patient:", error);
    return null;
  }
};

const PatientsPage: React.FC = () => {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [newPatient, setNewPatient] = useState({
    name: "",
    status: "active",
    doctorId: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [showTestFeatures, setShowTestFeatures] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        const patientData = await fetchPatients(filter);
        setPatients(patientData);
      } catch (error) {
        setError("Failed to load patients.");
      }
      setLoading(false);
    };

    const fetchDoctorData = async () => {
      try {
        const doctorData = await fetchDoctors("doctor@example.com");
        setDoctors(doctorData);
      } catch (error) {
        setError("Failed to load doctors.");
      }
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
    const createdPatient = await createPatient(newPatient, setError);
    if (createdPatient) {
      setPatients([...patients, createdPatient]);
      setNewPatient({ name: "", status: "active", doctorId: "" });
      setShowModal(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const result = await deletePatient(id, setError);
    if (result) {
      setPatients(patients.filter((patient) => patient.id !== id));
      setDeletingId(null);
      if (selectedPatient?.id === id) {
        setSelectedPatient(null);
        setChatMessages([]);
        setSummary("");
      }
    }
  };

  const handlePatientSelect = async (patient: any) => {
    setSelectedPatient(patient);
    if (patient.chatId) {
      const chat = await getChat(patient.chatId, patient.userId);
      if (chat && !("error" in chat)) {
        setChatMessages(chat.messages);
        setSummary(chat.summary);
      } else {
        setChatMessages([]);
        setSummary("No chat history found.");
      }
    } else {
      setChatMessages([]);
      setSummary("No chat history found.");
    }
  };

  const handleAssignDoctor = async (patientId: string, doctorId: string) => {
    const result = await assignDoctor(patientId, doctorId, setError);
    if (result && !result.error) {
      setPatients(
        patients.map((p) => (p.id === patientId ? { ...p, doctorId } : p))
      );
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  );

  const doctorMap = doctors.reduce((acc, doctor) => {
    acc[doctor.id] = doctor.name;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 to-gray-300">
      <header className="bg-white shadow-md p-4 mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Patients</h1>
        <div className="space-x-4">
          <a
            href="#"
            className="text-blue-500 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              setShowTestFeatures(true);
            }}
          >
            Test
          </a>
          <a
            href="#"
            className="text-blue-500 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              router.push("/doctor/info");
            }}
          >
            Info
          </a>
          <a
            href="#"
            className="text-blue-500 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              router.push("/doctor/setting");
            }}
          >
            Setting
          </a>
        </div>
      </header>

      <main className="flex flex-col max-w-6xl mx-auto space-y-6">
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {showTestFeatures && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6"
          >
            Add Patient
          </button>
        )}

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Create New Patient
              </h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={newPatient.name}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, name: e.target.value })
                  }
                  className="p-2 border rounded w-full"
                  required
                />
                <select
                  value={newPatient.status}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, status: e.target.value })
                  }
                  className="p-2 border rounded w-full"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select
                  value={newPatient.doctorId}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, doctorId: e.target.value })
                  }
                  className="p-2 border rounded w-full"
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Patient
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
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
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
                filteredPatients.map((patient) => (
                  <li
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient)}
                    className={`bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer ${
                      selectedPatient?.id === patient.id ? "bg-blue-100" : ""
                    }`}
                  >
                    <h2 className="text-xl font-semibold text-gray-800">
                      {patient.name}({patient.email})
                    </h2>
                    <p className="text-gray-600">ID: {patient.id}</p>
                    <p className="text-gray-600">Status: {patient.status}</p>
                    <p className="text-gray-600">
                      Doctor: {doctorMap[patient.doctorId]}
                    </p>

                    <div className="flex space-x-4 mt-4">
                      
                      {patient.doctorId && (
                        <button
                          onClick={() => handleAssignDoctor(patient.id, "")}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                          Cancel Assign
                        </button>
                      )}
                    </div>

                    {showTestFeatures && ( 
                      <button
                        onClick={() => handleDelete(patient.id)}
                        disabled={deletingId === patient.id}
                        className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        {deletingId === patient.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    )}
                  </li>
                ))
              )}
            </ul>
          )}
        </section>

        {selectedPatient && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Summary for {selectedPatient.name}
            </h3>
            <p className="mt-4 text-gray-800">
              <strong>Summary:</strong> {summary}
            </p>
          </div>
        )}

        {selectedPatient && (
          <div className="bg-white shadow-lg rounded-lg p-6 mt-4">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Chat for {selectedPatient.name}
            </h3>
            {chatMessages.length > 0 ? (
              <ul className="space-y-4">
                {chatMessages.map((message, index) => (
                  <li key={index} className="p-2 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-800">{message.text}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No chat history found.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientsPage;