import React, { useState } from 'react';

const ClinicInfoManagement: React.FC = () => {
  const [clinicInfo, setClinicInfo] = useState({
    name: '',
    email: '',
    location: '',
  });

  const handleUpdate = async () => {
    const response = await fetch('/api/clinic-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clinicInfo),
    });

    if (response.ok) {
      alert('Clinic info updated');
    } else {
      alert('Update failed');
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Clinic Information</h2>
      <div className="space-y-4">
        <input
          type="text"
          value={clinicInfo.name}
          onChange={(e) => setClinicInfo({ ...clinicInfo, name: e.target.value })}
          placeholder="Clinic Name"
          className="border p-3 w-full rounded-md"
        />
        <input
          type="email"
          value={clinicInfo.email}
          onChange={(e) => setClinicInfo({ ...clinicInfo, email: e.target.value })}
          placeholder="Clinic Email"
          className="border p-3 w-full rounded-md"
        />
        <input
          type="text"
          value={clinicInfo.location}
          onChange={(e) => setClinicInfo({ ...clinicInfo, location: e.target.value })}
          placeholder="Location"
          className="border p-3 w-full rounded-md"
        />
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Update Info
        </button>
      </div>
    </div>
  );
};

export default ClinicInfoManagement;
