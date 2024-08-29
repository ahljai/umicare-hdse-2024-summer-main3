"use client";

import React from "react";

interface PatientListProps {
  patients: any[];
  doctors: any[];
  search: string;
  filter: string;
  doctorFilter: string;
  loading: boolean;
  selectedPatient: any;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilter: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleDoctorFilter: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handlePatientSelect: (patient: any) => void;
  handleDelete: (id: string) => void;
  handleAssignDoctor: (patientId: string, doctorId: string) => void; // 添加这个prop
  deletingId: string | null;
  showTestFeatures: boolean;
}

const PatientList: React.FC<PatientListProps> = ({
  patients,
  doctors,
  search,
  filter,
  doctorFilter,
  loading,
  selectedPatient,
  handleSearch,
  handleFilter,
  handleDoctorFilter,
  handlePatientSelect,
  handleDelete,
  handleAssignDoctor,  // 确保这个函数被传递
  deletingId,
  showTestFeatures,
}) => {
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  );

  const doctorMap = doctors.reduce((acc, doctor) => {
    acc[doctor.id] = doctor.name;
    return acc;
  }, {} as Record<string, string>);

  return (
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
                    {deletingId === patient.id ? "Deleting..." : "Delete"}
                  </button>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </section>
  );
};

export default PatientList;