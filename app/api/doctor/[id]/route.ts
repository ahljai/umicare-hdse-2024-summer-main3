import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }

    const existingDoctorsData = await kv.get('doctor');
    let existingDoctors = [];

    if (existingDoctorsData) {
      if (typeof existingDoctorsData === 'string') {
        existingDoctors = JSON.parse(existingDoctorsData);
      } else if (Array.isArray(existingDoctorsData)) {
        existingDoctors = existingDoctorsData;
      } else {
        return NextResponse.json({ error: 'Unexpected data format in KV store' }, { status: 500 });
      }
    }

    const updatedDoctors = existingDoctors.filter((d: { id: string }) => d.id !== id);

    if (existingDoctors.length === updatedDoctors.length) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    await kv.set('doctor', JSON.stringify(updatedDoctors));

    return NextResponse.json({ message: 'Doctor deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete doctor' }, { status: 500 });
  }
}
//onyx