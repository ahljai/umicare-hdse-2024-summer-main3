import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

interface Patient {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  doctorId: string;
  doctorName?: string;
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }

    const existingPatientsData = await kv.get('patients');
    let existingPatients: Patient[] = []; // Explicitly typed as an array of Patients

    // Ensure existingPatientsData is a string before parsing
    if (typeof existingPatientsData === 'string') {
      existingPatients = JSON.parse(existingPatientsData);
    } else if (Array.isArray(existingPatientsData)) {
      existingPatients = existingPatientsData;
    }

    const patientIndex = existingPatients.findIndex((patient) => patient.id === id);
    if (patientIndex === -1) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    existingPatients.splice(patientIndex, 1);
    await kv.set('patients', JSON.stringify(existingPatients));

    return NextResponse.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete patient' }, { status: 500 });
  }
}
//onyx