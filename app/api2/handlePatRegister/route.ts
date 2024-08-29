// locate: app/api2/handlePatRegister/route.ts
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';

export interface Patient {
  phone: string;
  email: string;
  name: string;
  password: string;
  userType: string;
}
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
  const { email, phone, name, password } = await req.json();

  try {
    // get all data information
    const allKeys = await kv.keys('user:*');
    console.log(`Retrieved keys: ${allKeys}`);

     // Retrieve all keys
     const keys = await kv.keys('user:*');

     // Iterate through all keys to find the matching email
     for (const key of keys) {
       const user = await kv.get<User>(key);
       if (user && user.email === email) {
        console.log(`Email ${email} already in use by user ${key}`);
        return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
       }
     }

    const userId = uuidv4();
    const newPatient: Patient = {
      phone,
      email,
      name,
      password,
      userType: 'patient'
    };

    await kv.set(`user:${userId}`, newPatient);

    return NextResponse.json({ message: 'success', patient: newPatient });
  } catch (error) {
    const err = error as Error;
    console.error('Error registering patient:', err); 
    return NextResponse.json({ message: 'Error registering patient', error: err.message }, { status: 500 });
  }
}
