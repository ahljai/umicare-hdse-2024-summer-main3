import React from 'react';

interface Appointment {
  id: number;
  patientName: string;
  time: string;
  date: string;
}

const appointments: Appointment[] = [
  { id: 1, patientName: 'John Doe', time: '10:00 AM', date: '2024-08-20' },
  { id: 2, patientName: 'Jane Smith', time: '11:30 AM', date: '2024-08-20' },
  { id: 3, patientName: 'Robert Johnson', time: '02:00 PM', date: '2024-08-21' },
];

const TodayAppointmentSchedule: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];

  const todayAppointments = appointments.filter(
    appointment => appointment.date === today
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
      <ul>
        {todayAppointments.length > 0 ? (
          todayAppointments.map(appointment => (
            <li key={appointment.id} className="mb-2 p-2 border rounded-lg shadow-sm">
              <p className="text-gray-800">{appointment.patientName}</p>
              <p className="text-gray-600">{appointment.time}</p>
            </li>
          ))
        ) : (
          <p className="text-gray-600">No appointments scheduled for today.</p>
        )}
      </ul>
    </div>
  );
};

export default TodayAppointmentSchedule;
