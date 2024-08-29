"use client"; 
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';

import React from 'react';

interface User {
  userId: string;
  userType: string;
}

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userCookie = getCookie('user');
    if (userCookie) {
      const userData: User = JSON.parse(userCookie as string);
      setUser(userData);
    }
  }, []);

  if (!user) {
    return <div>No user found</div>;
  }

  return (
    <div>
      <h1>Welcome, User {user.userId}</h1>
      <p>User Type: {user.userType}</p>
    </div>
  );
};

export default UserProfile;
