"use client";

import React from "react";

interface PatientFormProps {
  newPatient: { name: string; status: string; doctorId: string };
  doctors: any[];
  setShowModal: (show: boolean) => void;
  handleCreate: (event: React.FormEvent) => void;
  setNewPatient: React.Dispatch<
    React.SetStateAction<{ name: string; status: string; doctorId: string }>
  >;
}

const PatientForm: React.FC<PatientFormProps> = ({
  newPatient,
  doctors,
  setShowModal,
  handleCreate,
  setNewPatient,
}) => {
  return (
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
  );
};

export default PatientForm;