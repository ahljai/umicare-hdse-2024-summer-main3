"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import TodaySchedule from '@/components/clinic/TodaySchedule';

interface ScheduleItem {
  time: string;
  event: string;
}

const WelcomePage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Function to update time
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    // Update time every second
    const intervalId = setInterval(updateTime, 1000);

    // Initialize time immediately
    updateTime();

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-100 to-blue-300">
      <header className="bg-white shadow-md p-4 mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to UMI Care</h1>
        <p className="text-gray-600">Manage your clinic, access patient information, book appointments, and more.</p>
        <p className="text-gray-800 mt-4 text-xl">Current Time: {currentTime}</p>
      </header>

      <main className="flex flex-wrap gap-6 max-w-6xl mx-auto">
        {/* Quick Access Block */}
        <section className="flex-1 min-w-[300px] bg-green-50 shadow-lg rounded-lg p-6 text-center transition-transform transform hover:scale-105">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Get Started</h3>
          <p className="text-gray-600 mb-6">Choose from the options below to get started:</p>
          <div className="flex flex-col text-black gap-6 sm:flex-row">
            {['Clinic Info', 'Appointments', 'Settings'].map((item) => (
              <motion.button
                key={item}
                onClick={() => navigateTo(`/clinic/${item.toLowerCase().replace(' ', '-')}`)}
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-black px-6 py-3 rounded-full hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                aria-label={`Go to ${item}`}
              >
                {item}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Today's Schedule Section */}
        <section className="flex-1 min-w-[300px] bg-yellow-50 shadow-lg rounded-lg p-6 text-center transition-transform transform hover:scale-105">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Today's Schedule</h3>
          <TodaySchedule />
        </section>
      </main>

      <footer className="text-center text-gray-500 text-sm mt-12 py-4 bg-white shadow-inner">
        <p>© 2024 UMI Care. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default WelcomePage;
