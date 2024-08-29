import React, { useEffect, useState } from 'react';

const PatientSummary: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await fetch('/api/patients');
      const data = await response.json();
      setPatients(data);
    };
    
    fetchPatients();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Patient Summary</h2>
      <ul className="space-y-4">
        {patients.map(patient => (
          <li key={patient.id} className="border-b pb-4">
            <h3 className="text-lg font-bold text-gray-700">{patient.name}</h3>
            <p className="text-gray-600">Status: {patient.status}</p>
            <p className="text-gray-600">ID: {patient.id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientSummary;
