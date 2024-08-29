"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from '@/components/clinic/Modal'; // Adjust the import path if needed

const AppointmentsPage: React.FC = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<{ id: string; name: string }[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentAppointment, setCurrentAppointment] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/appointments');
        if (!response.ok) throw new Error('Network response was not ok');
        const appointmentData = await response.json();
        setAppointments(appointmentData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/doctor');
        if (!response.ok) throw new Error('Network response was not ok');
        const doctorsData = await response.json();
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchAppointments();
    fetchDoctors();
  }, []);

  const handleAdd = () => {
    setCurrentAppointment(null);
    setIsEditing(true);
  };

  const handleEdit = (appointment: any) => {
    setCurrentAppointment(appointment);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
        setAppointments(appointments.filter(a => a.id !== id));
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const handleSave = async (appointment: any) => {
    try {
      if (currentAppointment) {
        await fetch(`/api/appointments/${currentAppointment.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointment),
        });
      } else {
        await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointment),
        });
      }
      const updatedAppointments = await (await fetch('/api/appointments')).json();
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error saving appointment:', error);
    } finally {
      setIsEditing(false);
      setCurrentAppointment(null);
    }
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 to-gray-300">
      <header className="bg-white shadow-md p-4 mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
      </header>

      <main className="flex flex-col space-y-6 max-w-6xl mx-auto">
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white py-2 px-4 rounded shadow-md hover:bg-blue-600"
          >
            Add New Appointment
          </button>
        </div>
        <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
          <AppointmentForm
            appointment={currentAppointment}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        </Modal>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointments Schedule</h2>
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                events={appointments.map(appointment => ({
                  title: appointment.title,
                  date: appointment.date,
                }))}
              />
            </div>
            <div className="space-y-4 mb-6">
              {appointments.length === 0 ? (
                <div className="text-center text-gray-500">No appointments found</div>
              ) : (
                appointments.map(appointment => (
                  <div key={appointment.id} className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800">{appointment.title}</h2>
                    <p className="text-gray-600">Date: {appointment.date}</p>
                    <p className="text-gray-600">Time: {appointment.time}</p>
                    <p className="text-gray-600">Patient: {appointment.patientName}</p>
                    <p className="text-gray-600">Doctor: {getDoctorName(appointment.doctorId)}</p>
                    <div className="flex space-x-4 mt-4">
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="bg-yellow-500 text-white py-1 px-4 rounded shadow-md hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="bg-red-500 text-white py-1 px-4 rounded shadow-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

const AppointmentForm: React.FC<{
  appointment: any;
  onSave: (appointment: any) => void;
  onCancel: () => void;
}> = ({ appointment, onSave, onCancel }) => {
  const [title, setTitle] = useState(appointment?.title || '');
  const [date, setDate] = useState(appointment?.date || '');
  const [time, setTime] = useState(appointment?.time || '');
  const [patientName, setPatientName] = useState(appointment?.patientName || '');
  const [doctorId, setDoctorId] = useState(appointment?.doctorId || '');
  const [doctors, setDoctors] = useState<{ id: string; name: string }[]>([]);
  const [patients, setPatients] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/doctor');
        if (!response.ok) throw new Error('Failed to fetch doctors');
        const doctorsData = await response.json();
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to fetch doctors.');
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/patients');
        if (!response.ok) throw new Error('Failed to fetch patients');
        const patientsData = await response.json();
        setPatients(patientsData);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setError('Failed to fetch patients.');
      }
    };
    fetchPatients();
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave({ id: appointment?.id, title, date, time, patientName, doctorId });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {appointment ? 'Edit Appointment' : 'Add New Appointment'}
      </h2>
      <div className="mb-4">
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Patient</label>
        <select
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          className="border rounded w-full p-2"
          required
        >
          <option value="" disabled>Select a patient</option>
          {patients.map(patient => (
            <option key={patient.id} value={patient.name}>{patient.name}</option>
          ))}
          <option value="other">Other</option>
        </select>
        {patientName === 'other' && (
          <div className="mt-2">
            <label className="block text-gray-700">New Patient Name</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="border rounded w-full p-2"
            />
          </div>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Doctor</label>
        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          className="border rounded w-full p-2"
          required
        >
          <option value="" disabled>Select a doctor</option>
          {doctors.map(doctor => (
            <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
          ))}
        </select>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded shadow-md hover:bg-blue-600"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white py-2 px-4 rounded shadow-md hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AppointmentsPage;
//onyx