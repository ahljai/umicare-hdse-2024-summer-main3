// app/clinic/layout.tsx
import Navbar from '../../components/clinic/Navbar';
import { FC, ReactNode } from 'react';

const ClinicLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-4">
        {children}
      </main>
    </div>
  );
};

export default ClinicLayout;
