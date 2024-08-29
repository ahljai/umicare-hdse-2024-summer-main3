// locate: components/Doctor/DoctorInfoClient.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';

const DoctorInfoClient = () => {
  const [user, setUser] = useState<{ userId: string; userType: string } | null>(null);

  useEffect(() => {
    const userCookie = getCookie('user');
    if (userCookie) {
      setUser(JSON.parse(userCookie as string));
    }
  }, []);

  if (!user) {
    return <p>User is not logged in</p>;
  }

  return (
    <div className="doctor-info">
      <h1>Welcome, {user.userId}</h1>
      <p>User Type: {user.userType}</p>
    </div>
  );
};

export default DoctorInfoClient;