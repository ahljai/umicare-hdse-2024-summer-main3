import React, { useEffect, useState } from 'react';

const AppointmentSchedule: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      setAppointments(data);
    };
    
    fetchAppointments();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Appointment Schedule</h2>
      <ul className="space-y-4">
        {appointments.map(appt => (
          <li key={appt.id} className="border-b pb-4">
            <h3 className="text-lg font-bold text-gray-700">{appt.patientName}</h3>
            <p className="text-gray-600">Date: {appt.date}</p>
            <p className="text-gray-600">Time: {appt.time}</p>
            <p className="text-gray-600">Reason: {appt.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentSchedule;
