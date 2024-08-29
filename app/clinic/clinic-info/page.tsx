"use client";

import React, { useState, useEffect } from 'react';

interface ClinicInfoData {
  clinicName: string;
  address: string;
  phone: string;
  email: string;
  operatingHours: string;
}

const ClinicInfo: React.FC = () => {
  const [clinicInfo, setClinicInfo] = useState<ClinicInfoData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ClinicInfoData>({
    clinicName: '',
    address: '',
    phone: '',
    email: '',
    operatingHours: '',
  });

  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {
        const response = await fetch('/api/clinic/settings');
        if (!response.ok) {
          throw new Error('Failed to fetch clinic info');
        }
        const data = await response.json();
        setClinicInfo(data);
        setFormData(data); 
      } catch (error) {
        console.error('Failed to fetch clinic info:', error);
      }
    };

    fetchClinicInfo();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/clinic/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setClinicInfo(updatedData);
        setIsEditing(false);
      } else {
        alert('Failed to update settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Clinic Information</h2>
      {clinicInfo ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Clinic Name:</span>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.clinicName}
                onChange={handleChange}
                className="border rounded p-2"
                placeholder="Enter clinic name"
              />
            ) : (
              <span>{clinicInfo.clinicName}</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Address:</span>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="border rounded p-2"
                placeholder="Enter address"
              />
            ) : (
              <span>{clinicInfo.address}</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Phone Number:</span>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border rounded p-2"
                placeholder="Enter phone number"
              />
            ) : (
              <span>{clinicInfo.phone}</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Email Address:</span>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border rounded p-2"
                placeholder="Enter email address"
              />
            ) : (
              <span>{clinicInfo.email}</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Operating Hours:</span>
            {isEditing ? (
              <input
                type="text"
                name="operatingHours"
                value={formData.operatingHours}
                onChange={handleChange}
                className="border rounded p-2"
                placeholder="Enter operating hours"
              />
            ) : (
              <span>{clinicInfo.operatingHours}</span>
            )}
          </div>

          <div className="mt-4 flex justify-end space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-black py-2 px-4 rounded shadow-md"
                >
                  Save
                </button>
                <button
                  onClick={handleEditToggle}
                  className="bg-gray-500 text-black py-2 px-4 rounded shadow-md"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="bg-yellow-500 text-black py-2 px-4 rounded shadow-md"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Loading...</p>
      )}
    </div>
  );
};

export default ClinicInfo;
//onyx