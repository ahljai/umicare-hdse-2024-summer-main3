import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

interface Appointment {
  title: string;
  date: string;
  time: string;
  patientName: string;
  doctorId: string;
  id?: string;
}

async function getAppointmentsData(): Promise<Appointment[]> {
  const existingAppointmentsData = await kv.get('appointments');
  if (existingAppointmentsData) {
    if (typeof existingAppointmentsData === 'string') {
      return JSON.parse(existingAppointmentsData);
    } else if (Array.isArray(existingAppointmentsData)) {
      return existingAppointmentsData;
    } else {
      throw new Error('Unexpected data format');
    }
  }
  return [];
}

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();

    if (typeof requestBody !== 'object' || requestBody === null) {
      return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
    }

    const appointment: Appointment = {
      title: requestBody.title,
      date: requestBody.date,
      time: requestBody.time,
      patientName: requestBody.patientName,
      doctorId: requestBody.doctorId,
      id: requestBody.id || uuidv4()
    };

    if (!appointment.title || !appointment.date || !appointment.time || !appointment.patientName || !appointment.doctorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingAppointments = await getAppointmentsData();
    existingAppointments.push(appointment);
    await kv.set('appointments', JSON.stringify(existingAppointments));

    return NextResponse.json(appointment, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const existingAppointments = await getAppointmentsData();
    return NextResponse.json(existingAppointments);
  } catch {
    return NextResponse.json({ error: 'Failed to retrieve appointments' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const requestBody = await request.json();

    if (typeof requestBody !== 'object' || requestBody === null) {
      return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
    }

    const appointment: Appointment = {
      title: requestBody.title,
      date: requestBody.date,
      time: requestBody.time,
      patientName: requestBody.patientName,
      doctorId: requestBody.doctorId,
      id: requestBody.id
    };

    const id = request.url.split('/').pop();

    if (!id || appointment.id !== id) {
      return NextResponse.json({ error: 'Appointment ID is required or mismatched' }, { status: 400 });
    }

    const existingAppointments = await getAppointmentsData();
    const index = existingAppointments.findIndex(app => app.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    existingAppointments[index] = { ...existingAppointments[index], ...appointment };
    await kv.set('appointments', JSON.stringify(existingAppointments));

    return NextResponse.json(existingAppointments[index]);
  } catch {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    const existingAppointments = await getAppointmentsData();
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

export async function GET_TODAY(request: Request) {
  try {
    const existingAppointments = await getAppointmentsData();
    const today = new Date().toISOString().split('T')[0];
    const todaysAppointments = existingAppointments.filter(app => app.date === today);
    
    if (todaysAppointments.length === 0) {
      console.log('No appointments scheduled for today.');
    }

    return NextResponse.json(todaysAppointments);
  } catch (error) {
    console.error('Failed to retrieve today\'s appointments:', error);
    return NextResponse.json({ error: 'Failed to retrieve today\'s appointments' }, { status: 500 });
  }
}

//onyx