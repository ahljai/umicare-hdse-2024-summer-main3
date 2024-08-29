// locate: app/api2/setDoctor/route.ts
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
  doctor?: string;
  clinic?: string;
}

export async function POST(req: Request) {
  const { userId, email, phone, name, password, clinic} = await req.json();

  if (!userId || !email || !phone || !name || !password || !clinic ) {
    return NextResponse.json({ error: 'Please input all data' }, { status: 400 });
  }

  try {
    const userKey = `user:${userId}`;
    const user = await kv.get<User>(userKey);

    if (user) {
      const updatedUser = { ...user, email, phone, name, password, clinic };

      await kv.set(userKey, updatedUser);

      return NextResponse.json({ message: 'User updated successfully', user: updatedUser });
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
