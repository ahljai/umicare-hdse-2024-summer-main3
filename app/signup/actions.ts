'use server'

import { z } from 'zod'
import { ResultCode } from '@/lib/utils'
import { kv } from '@vercel/kv'
import { v4 as uuidv4 } from 'uuid'

interface Result {
  type: 'success' | 'error';
  resultCode: ResultCode;
}

interface User {
  email: string;
  phone: string;
  name: string;
  password: string;
  userType: string;
}

export async function signup(
  _prevState: Result | undefined,
  formData: FormData
): Promise<Result> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string

  const parsedCredentials = z
    .object({
      email: z.string().email(),
      password: z.string().min(8),
      name: z.string(),
      phone: z.string()
    })
    .safeParse({
      email,
      password,
      name,
      phone
    })

  if (parsedCredentials.success) {
    try {
      // Check if email already exists
      const keys = await kv.keys('user:*')
      for (const key of keys) {
        const user = await kv.get<User | null>(key)
        if (user && user.email === email) {
          return {
            type: 'error',
            resultCode: ResultCode.UserAlreadyExists
          }
        }
      }

      // Create new user
      const userId = uuidv4()
      const newPatient: User = {
        phone,
        email,
        name,
        password, // Note: In a real application, you should hash this password
        userType: 'patient'
      }

      await kv.set(`user:${userId}`, newPatient)

      return {
        type: 'success',
        resultCode: ResultCode.UserCreated
      }
    } catch (error) {
      console.error('Error during registration:', error)
      return {
        type: 'error',
        resultCode: ResultCode.UnknownError
      }
    }
  } else {
    return {
      type: 'error',
      resultCode: ResultCode.InvalidCredentials
    }
  }
}