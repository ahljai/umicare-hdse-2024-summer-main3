import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUser } from '@/app/login/actions';
import { User } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.user.email;

    if (!email) {
      return NextResponse.json({ error: 'Email not found in session' }, { status: 400 });
    }

    const doctor = await getUser(email);

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    return NextResponse.json({ error: 'Failed to fetch doctor profile' }, { status: 500 });
  }
}