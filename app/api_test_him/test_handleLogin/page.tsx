// locate: app/api_test_him/test_handleLogin/page.tsx
"use client"; 
import { useState } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';

const handleLogin = async (email: string, password: string, setLoginMessage: (message: string) => void, router: any) => {
  try {
    const response = await fetch('/api2/handleLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    
    if (data.message === 'fail') {
      setLoginMessage(`${data.message}: ${data.reason}`);
    } else {
      setLoginMessage(`Login successful! User ID: ${data.key}, User Type: ${data.type}`);
      
      // Redirect based on userType
      switch (data.type) {
        case 'clinic':
          router.push('/clinic');
          break;
        case 'doctor':
          router.push('/doctor');
          break;
        case 'doctor':
          router.push('/doctor');
          break;
        default:
          router.push('/');
          break;
      }
    }
  } catch (error) {
    console.error('Error handling login:', error);
    setLoginMessage('Error handling login');
  }
};

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const router = useRouter();

  const onSubmit = () => {
    handleLogin(email, password, setLoginMessage, router);
  };

  return (
    <div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={onSubmit}>Login</button>
      <p>{loginMessage}</p>
    </div>
  );
};

export default LoginComponent;
