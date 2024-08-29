import React, { useState } from 'react';

const AppointmentBooking: React.FC = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [patient, setPatient] = useState('');
  
  const handleBooking = async () => {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, time, patient }),
    });

    if (response.ok) {
      alert('Booking successful');
    } else {
      alert('Booking failed');
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Book an Appointment</h2>
      <div className="space-y-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-3 w-full rounded-md"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border p-3 w-full rounded-md"
        />
        <input
          type="text"
          value={patient}
          onChange={(e) => setPatient(e.target.value)}
          placeholder="Patient Name"
          className="border p-3 w-full rounded-md"
        />
        <button
          onClick={handleBooking}
          className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default AppointmentBooking;
