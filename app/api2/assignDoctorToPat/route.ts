// locate: app/api2/assignDoctorToPat/route.ts
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
  assignedAt?: number; // timestamp for when the doctor was assigned
}

export async function POST(req: Request) {
  const { userId, doctor } = await req.json();

  if (!userId || !doctor) {
    return NextResponse.json({ error: 'User ID and Doctor are required' }, { status: 400 });
  }

  try {
    const userKey = `user:${userId}`;
    const user = await kv.get<User>(userKey);

    if (user) {

      // Check if the user already has an assigned doctor and the assignment is still valid
      const now = Date.now();
      const isWithin14Days = user.assignedAt && (now - user.assignedAt) < 14 * 24 * 60 * 60 * 1000;
      
      if (isWithin14Days && user.doctor === doctor) {
        return NextResponse.json({ error: 'Doctor already assigned and cannot be changed within 14 days' }, { status: 400 });
      }
      
      // Update the user with the new doctor and set the assignment timestamp
      const updatedUser = { ...user, doctor, assignedAt: now };

      await kv.set(userKey, updatedUser);

      // Schedule to set doctor to null after 14 days
      setTimeout(async () => {
        const currentUser = await kv.get<User>(userKey);
        if (currentUser && currentUser.doctor === doctor) {
          await kv.set(userKey, { ...currentUser, doctor: null });
        }
      }, 14 * 24 * 60 * 60 * 1000); // 14 days in milliseconds

      return NextResponse.json({ message: 'User updated successfully', user: updatedUser });
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error assigning doctor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}