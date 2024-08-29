import { z } from 'zod'
import { ResultCode } from '@/lib/utils'

interface Result {
  type: 'success' | 'error';
  resultCode: ResultCode;
  redirectUrl?: string;
}

export async function authenticate(
  _prevState: Result | undefined,
  formData: FormData
): Promise<Result | undefined> {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const parsedCredentials = z
      .object({
        email: z.string().email(),
        password: z.string().min(8)
      })
      .safeParse({
        email,
        password
      })

    if (parsedCredentials.success) {
      const response = await fetch('/api2/handleLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.message === 'fail') {
        return {
          type: 'error',
          resultCode: ResultCode.InvalidCredentials
        }
      } else {
        switch (data.type) {
          case 'clinic':
            return {
              type: 'success',
              resultCode: ResultCode.UserLoggedIn,
              redirectUrl: '/clinic'
            }
          case 'doctor':
            return {
              type: 'success',
              resultCode: ResultCode.UserLoggedIn,
              redirectUrl: '/doctor'
            }
          case 'patient':
            return {
              type: 'success',
              resultCode: ResultCode.UserLoggedIn,
              redirectUrl: '/patient_sam'
            }
          default:
            return {
              type: 'error',
              resultCode: ResultCode.UnknownError
            }
        }
      }
    } else {
      return {
        type: 'error',
        resultCode: ResultCode.InvalidCredentials
      }
    }
  } catch (error) {
    return {
      type: 'error',
      resultCode: ResultCode.UnknownError
    }
  }
}
