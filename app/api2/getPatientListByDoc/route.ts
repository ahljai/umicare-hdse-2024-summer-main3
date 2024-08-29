// locate: app/api2/getPatientListByDoc/route.ts
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

interface User {
  email: string;
  phone: string;
  name: string;
  password: string;
  userType: string;
  doctor: string;
  clinic: string;
}

export async function POST(req: Request) {
  const { doctor } = await req.json();

  if (!doctor) {
    return NextResponse.json({ error: 'Doctor is required' }, { status: 400 });
  }

  try {
    // Retrieve all keys
    const keys = await kv.keys('user:*');
    const matchingUsers: { uid: string, user: User }[] = [];

    // Iterate through all keys to find matching users
    for (const key of keys) {
      const user = await kv.get<User>(key);
      if (user && user.doctor === doctor) {
        matchingUsers.push({ uid: key.split(':')[1], user });
      }
    }

    if (matchingUsers.length > 0) {
      return NextResponse.json({ users: matchingUsers });
    } else {
      return NextResponse.json({ error: 'No matching users found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
