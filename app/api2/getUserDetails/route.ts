// locate: app/api2/getTargetClinic/route.ts
// get user details by email
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

interface User {
  email: string;
  phone: string;
  name: string;
  password: string;
  userType: string;
  address: string;
  operatingHours: string;
}

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    // Retrieve all keys
    const keys = await kv.keys('user:*');

    // Iterate through all keys to find the matching email
    for (const key of keys) {
      const user = await kv.get<User>(key);
      if (user && user.email === email) {
        return NextResponse.json({ uid: key.split(':')[1], user });
      }
    }

    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
