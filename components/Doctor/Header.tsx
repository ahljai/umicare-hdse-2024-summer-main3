"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const router = useRouter();

  return (
    <header className="bg-white shadow-md p-4 mb-6 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-800">Patients</h1>
      <div className="space-x-4">
        <a
          href="#"
          className="text-blue-500 hover:underline"
          onClick={(e) => {
            e.preventDefault();
            // Handle test feature toggle
          }}
        >
          Test
        </a>
        <a
          href="#"
          className="text-blue-500 hover:underline"
          onClick={(e) => {
            e.preventDefault();
            router.push("/doctor/info");
          }}
        >
          Info
        </a>
        <a
          href="#"
          className="text-blue-500 hover:underline"
          onClick={(e) => {
            e.preventDefault();
            router.push("/doctor/setting");
          }}
        >
          Setting
        </a>
      </div>
    </header>
  );
};

export default Header;