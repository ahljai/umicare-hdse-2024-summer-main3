import React from 'react';
import { useRouter } from 'next/navigation';

const ClinicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      {/* Navigation Bar */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-blue-600">Clinic Dashboard</h1>
          <nav className="space-x-6">
            {['Dashboard', 'Patients', 'Appointments', 'Settings'].map((item) => (
              <button
                key={item}
                onClick={() => navigateTo(`/clinic/${item.toLowerCase()}`)}
                className="text-blue-500 hover:text-blue-700 font-semibold transition-colors duration-300"
                aria-label={`Go to ${item}`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-wrap justify-center items-start p-8 max-w-6xl mx-auto space-x-6 mt-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm mt-12 py-4 bg-white shadow-inner">
        <p>© 2024 Umi Care Clinic. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ClinicLayout;
