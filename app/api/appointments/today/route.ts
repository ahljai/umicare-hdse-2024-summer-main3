import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

interface Appointment {
  title: string;
  date: string;
  time: string;
  patientName: string;
  patientId: string;
  doctorId: string;
  id?: string;
  doctorName?: string;
}

interface Doctor {
  id?: string;
  name: string;
  contactNumber?: string;
}

const getTodayDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

async function getAppointmentsData(): Promise<Appointment[]> {
  const existingAppointmentsData = await kv.get('appointments');

  if (!existingAppointmentsData) {
    return [];
  }

  if (typeof existingAppointmentsData === 'string') {
    return JSON.parse(existingAppointmentsData);
  } else if (Array.isArray(existingAppointmentsData)) {
    return existingAppointmentsData as Appointment[];
  } else {
    throw new Error('Unexpected data format');
  }
}

async function getDoctorsData(): Promise<Doctor[]> {
  const doctorsData = await kv.get('doctor');

  if (!doctorsData) {
    return [];
  }

  if (typeof doctorsData === 'string') {
    return JSON.parse(doctorsData);
  } else if (Array.isArray(doctorsData)) {
    return doctorsData as Doctor[];
  } else {
    throw new Error('Unexpected data format');
  }
}

export async function GET() {
  try {
    const existingAppointments = await getAppointmentsData();
    const doctors = await getDoctorsData();
    const todayDate = getTodayDate();

    const todayAppointments = existingAppointments
      .filter(appointment => appointment.date === todayDate)
      .map(appointment => {
        const doctor = doctors.find(doc => doc.id === appointment.doctorId);
        return {
          ...appointment,
          doctorName: doctor ? doctor.name : 'Unknown',
        };
      });

    return NextResponse.json(todayAppointments);
  } catch {
    return NextResponse.json({ error: "Failed to retrieve today's appointments" }, { status: 500 });
  }
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
      patientId: requestBody.patientId,
      doctorId: requestBody.doctorId,
      id: requestBody.id || uuidv4(),
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
      patientId: requestBody.patientId,
      doctorId: requestBody.doctorId,
      id: requestBody.id,
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
