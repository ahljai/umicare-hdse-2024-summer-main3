import React, { useEffect, useState } from 'react';

interface ClinicInfoData {
  clinicName: string;
  address: string;
  phone: string;
  email: string;
  operatingHours: string;
}

const ClinicInfo: React.FC = () => {
  const [clinicInfo, setClinicInfo] = useState<ClinicInfoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {
        const response = await fetch('/api/clinic-info');
        if (!response.ok) {
          throw new Error('Failed to fetch clinic info');
        }
        const data: ClinicInfoData = await response.json();
        setClinicInfo(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching clinic info:', error);
        setError('Unable to load clinic information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClinicInfo();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Clinic Information</h2>
      <p className="text-gray-600 mb-2"><strong>Clinic Name:</strong> {clinicInfo?.clinicName || 'N/A'}</p>
      <p className="text-gray-600 mb-2"><strong>Address:</strong> {clinicInfo?.address || 'N/A'}</p>
      <p className="text-gray-600 mb-2"><strong>Phone Number:</strong> {clinicInfo?.phone || 'N/A'}</p>
      <p className="text-gray-600 mb-2"><strong>Email Address:</strong> {clinicInfo?.email || 'N/A'}</p>
      <p className="text-gray-600 mb-2"><strong>Operating Hours:</strong> {clinicInfo?.operatingHours || 'N/A'}</p>
    </div>
  );
};

export default ClinicInfo;
