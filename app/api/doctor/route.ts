import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

interface Doctor {
  id?: string;
  name: string;
  contactNumber?: string;
}

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { name, contactNumber } = requestBody;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const doctor: Doctor = {
      id: uuidv4(),
      name,
      contactNumber,
    };

    const existingDoctorsData = await kv.get('doctor');
    let existingDoctors: Doctor[] = [];
    if (existingDoctorsData) {
      if (typeof existingDoctorsData === 'string') {
        existingDoctors = JSON.parse(existingDoctorsData);
      } else if (Array.isArray(existingDoctorsData)) {
        existingDoctors = existingDoctorsData;
      } else {
        return NextResponse.json({ error: 'Unexpected data format in KV store' }, { status: 500 });
      }
    }

    existingDoctors.push(doctor);
    await kv.set('doctor', JSON.stringify(existingDoctors));

    return NextResponse.json(doctor, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const existingDoctorsData = await kv.get('doctor');
    let doctors: Doctor[] = [];
    if (existingDoctorsData) {
      if (typeof existingDoctorsData === 'string') {
        doctors = JSON.parse(existingDoctorsData);
      } else if (Array.isArray(existingDoctorsData)) {
        doctors = existingDoctorsData;
      } else {
        return NextResponse.json({ error: 'Unexpected data format in KV store' }, { status: 500 });
      }
    }

    return NextResponse.json(doctors);
  } catch {
    return NextResponse.json({ error: 'Failed to retrieve doctors' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const requestBody = await request.json();
    const { id, name, contactNumber } = requestBody;

    if (!id || !name) {
      return NextResponse.json({ error: 'ID and Name are required' }, { status: 400 });
    }

    const existingDoctorsData = await kv.get('doctor');
    let existingDoctors: Doctor[] = [];
    if (existingDoctorsData) {
      if (typeof existingDoctorsData === 'string') {
        existingDoctors = JSON.parse(existingDoctorsData);
      } else if (Array.isArray(existingDoctorsData)) {
        existingDoctors = existingDoctorsData;
      } else {
        return NextResponse.json({ error: 'Unexpected data format in KV store' }, { status: 500 });
      }
    }

    const index = existingDoctors.findIndex(d => d.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    existingDoctors[index] = { ...existingDoctors[index], name, contactNumber };
    await kv.set('doctor', JSON.stringify(existingDoctors));

    return NextResponse.json(existingDoctors[index]);
  } catch {
    return NextResponse.json({ error: 'Failed to update doctor' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }

    const existingDoctorsData = await kv.get('doctor');
    let existingDoctors: Doctor[] = [];
    if (existingDoctorsData) {
      if (typeof existingDoctorsData === 'string') {
        existingDoctors = JSON.parse(existingDoctorsData);
      } else if (Array.isArray(existingDoctorsData)) {
        existingDoctors = existingDoctorsData;
      } else {
        return NextResponse.json({ error: 'Unexpected data format in KV store' }, { status: 500 });
      }
    }

    const updatedDoctors = existingDoctors.filter(d => d.id !== id);

    if (existingDoctors.length === updatedDoctors.length) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    await kv.set('doctor', JSON.stringify(updatedDoctors));

    return NextResponse.json({ message: 'Doctor deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete doctor' }, { status: 500 });
  }
}
