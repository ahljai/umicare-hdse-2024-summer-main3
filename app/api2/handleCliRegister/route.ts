// locate: app/api2/handleCliRegister/route.ts
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';

export interface ClinicUser {
  email: string;
  phone: string;
  name: string;
  password: string;
  userType: string;
  address: string;
  operatingHours: string;
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
  const { email, name, phone, address, password, operatingHours } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

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
    const userType = 'clinic';

    const newUser: ClinicUser = {
      email,
      phone,
      name,
      password,
      userType,
      address,
      operatingHours,
    };

    // change the target to jsoon
    const userString = JSON.stringify(newUser);
    console.log(`Storing new user: ${userString}`);
    await kv.set(`user:${userId}`, userString);

    return NextResponse.json({ message: 'success', userId });
  } catch (error) {
    const err = error as Error;
    console.error('Error registering user:', err); // record error
    return NextResponse.json({ message: 'Error registering user', error: err.message }, { status: 500 });
  }
}
