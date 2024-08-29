// locate: app/api2/handleLogin/route.ts
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { setCookie } from 'cookies-next';

export interface User {
  phone: string;
  userId: string;
  name: string;
  password: string;
  userType: string;
  email: string;
}

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    // get all user:key
    const keys = await kv.keys('user:*');
    console.log(`Retrieved keys: ${keys}`);

    let user: User | null = null;
    let userKey: string | null = null;

    // loop all data to find email
    for (const key of keys) {
      const tempUser = await kv.get<User>(key);
      if (tempUser && tempUser.email === email) {
        user = tempUser;
        userKey = key;
        break;
      }
    }

    // if no email return no such email
    if (!user) {
      return NextResponse.json({ message: 'fail', reason: 'no such email' }, { status: 404 });
    }

    // check password success?
    if (user.password !== password) {
      return NextResponse.json({ message: 'fail', reason: 'wrong password' }, { status: 401 });
    }

    // Set session or cookie
    const response = NextResponse.json({ message: 'success', type: user.userType, key: userKey });
    setCookie('user', JSON.stringify({ userId: userKey, userType: user.userType }), { req, res: response });

    return response;
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching data:', err); // record error
    return NextResponse.json({ message: 'Error fetching data', error: err.message }, { status: 500 });
  }
}

