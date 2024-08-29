// locate: app/api/currentDoctor/route.ts

import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { cookies } from 'next/headers'; 
export interface Doctor {
  id: string;
  name: string;
  email: string;
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const userCookie = cookieStore.get('user');

    if (!userCookie) {
      return NextResponse.json({ message: 'fail', reason: 'Not authenticated' }, { status: 401 });
    }

    const { userId, userType } = JSON.parse(userCookie.value);

    if (userType !== 'doctor') {
      return NextResponse.json({ message: 'fail', reason: 'User is not a doctor' }, { status: 403 });
    }

    const doctor = await kv.get<Doctor>(userId);

    if (!doctor) {
      return NextResponse.json({ message: 'fail', reason: 'Doctor not found' }, { status: 404 });
    }


    return NextResponse.json({ id: doctor.id, name: doctor.name, email: doctor.email });
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching doctor data:', err);
    return NextResponse.json({ message: 'Error fetching doctor data', error: err.message }, { status: 500 });
  }
}