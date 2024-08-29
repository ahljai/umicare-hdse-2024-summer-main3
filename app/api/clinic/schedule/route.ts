import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

interface Appointment {
  title: string;
  date: string;
  time: string;
  patientName: string;
  patientId: string;
  id?: string;
}
export async function GET() {
  try {
    console.log('Fetching appointments from KV store...');
    const existingAppointmentsData = await kv.get('appointments');

    console.log('Data retrieved from KV store:', existingAppointmentsData); 
    let existingAppointments: Appointment[] = [];
    if (existingAppointmentsData) {
      if (typeof existingAppointmentsData === 'string') {
        existingAppointments = JSON.parse(existingAppointmentsData);
      } else if (Array.isArray(existingAppointmentsData)) {
        existingAppointments = existingAppointmentsData;
      } else {
        console.error('Unexpected data format:', existingAppointmentsData); 
        return NextResponse.json({ error: 'Unexpected data format' }, { status: 500 });
      }
    }

    const today = new Date().toISOString().split('T')[0];
    console.log('Today\'s date:', today);

    const todayAppointments = existingAppointments.filter(app => app.date === today);
    console.log('Appointments for today:', todayAppointments); 

    return NextResponse.json(todayAppointments);
  } catch (error) {
    console.error('Error retrieving appointments:', error);
    return NextResponse.json({ error: 'Failed to retrieve appointments' }, { status: 500 });
  }
}
//onyx