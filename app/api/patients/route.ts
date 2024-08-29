import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

interface Patient {
  id?: string;
  name: string;
  status: 'active' | 'inactive';
  doctorId: string;
  doctorName?: string;
}

export async function POST(request: Request) {
  try {
    const { name, status, doctorId } = await request.json();

    if (!name || !status || !doctorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const patient: Patient = {
      id: uuidv4(),
      name,
      status,
      doctorId,
    };

    const existingPatientsData = await kv.get('patients');
    let existingPatients: Patient[] = [];

    if (existingPatientsData) {
      existingPatients = typeof existingPatientsData === 'string' 
        ? JSON.parse(existingPatientsData) 
        : existingPatientsData;
    }

    existingPatients.push(patient);
    await kv.set('patients', JSON.stringify(existingPatients));

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const existingPatientsData = await kv.get('patients');
    let patients: Patient[] = [];

    if (existingPatientsData) {
      patients = typeof existingPatientsData === 'string' 
        ? JSON.parse(existingPatientsData) 
        : existingPatientsData;
    }

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error retrieving patients:', error);
    return NextResponse.json({ error: 'Failed to retrieve patients' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, status, doctorId } = await request.json();

    if (!id || !name || !status || !doctorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingPatientsData = await kv.get('patients');
    let existingPatients: Patient[] = [];

    if (existingPatientsData) {
      existingPatients = typeof existingPatientsData === 'string' 
        ? JSON.parse(existingPatientsData) 
        : existingPatientsData;
    }

    const index = existingPatients.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    existingPatients[index] = { ...existingPatients[index], name, status, doctorId };
    await kv.set('patients', JSON.stringify(existingPatients));

    return NextResponse.json(existingPatients[index]);
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop()?.trim();

    if (!id) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }

    const existingPatientsData = await kv.get('patients');
    let existingPatients: Patient[] = [];

    if (existingPatientsData) {
      existingPatients = typeof existingPatientsData === 'string' 
        ? JSON.parse(existingPatientsData) 
        : existingPatientsData;
    }

    console.log('Existing Patient IDs:', existingPatients.map(p => p.id));
    console.log('ID to Delete:', id);

    const updatedPatients = existingPatients.filter(p => p.id !== id);

    console.log('Updated Patient IDs:', updatedPatients.map(p => p.id));

    if (existingPatients.length === updatedPatients.length) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    await kv.set('patients', JSON.stringify(updatedPatients));

    return NextResponse.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    return NextResponse.json({ error: 'Failed to delete patient' }, { status: 500 });
  }
}
//onyx