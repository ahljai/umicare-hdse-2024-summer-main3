// locate: app/api2/handleDocRegister/route.ts
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';

export interface DoctorUser {
  email: string;
  phone: string;
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
  
  const { email, name, phone, address, password } = await req.json();
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
  try {
    const userId = uuidv4();
    const userType = 'doctor';

    const newUser: DoctorUser = {
      email,
      phone,
      name,
      password,
      userType
    };

    await kv.set(`user:${userId}`, newUser);

    return NextResponse.json({ message: 'success', userId });
  } catch (error) {
    const err = error as Error;
    console.error('Error registering user:', err); // record error
    return NextResponse.json({ message: 'Error registering user', error: err.message }, { status: 500 });
  }
}
