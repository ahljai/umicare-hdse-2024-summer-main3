import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

interface Appointment {
  title: string;
  date: string;
  time: string;
  patientName: string;
  patientId: string;
  id?: string;
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    const existingAppointmentsData = await kv.get('appointments');
    let existingAppointments: Appointment[] = [];

    if (existingAppointmentsData) {
      if (typeof existingAppointmentsData === 'string') {
        existingAppointments = JSON.parse(existingAppointmentsData);
      } else if (Array.isArray(existingAppointmentsData)) {
        existingAppointments = existingAppointmentsData;
      } else {
        return NextResponse.json({ error: 'Unexpected data format' }, { status: 500 });
      }
    }

    const updatedAppointments = existingAppointments.filter(app => app.id !== id);

    if (existingAppointments.length === updatedAppointments.length) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    await kv.set('appointments', JSON.stringify(updatedAppointments));

    return NextResponse.json({ message: 'Appointment deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}
//onyx