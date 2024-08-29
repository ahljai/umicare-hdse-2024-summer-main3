import React from 'react'

type AppointmentSchedulerProps = {
  date: string
  doctor: string
}

export const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({ date, doctor }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
      <h3 className="text-xl font-bold mb-2 text-green-600">Appointment Scheduled</h3>
      <p className="text-gray-700">
        <span className="font-semibold">Date:</span> {date}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold">Doctor:</span> Dr. {doctor}
      </p>
    </div>
  )
}
