import Link from 'next/link';
import { FC } from 'react';

const Navbar: FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
      <li>
          <Link href="/clinic" className="text-white hover:text-gray-400">
            Home
          </Link>
        </li>
        <li>
          <Link href="/clinic/dashboard" className="text-white hover:text-gray-400">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/clinic/appointments" className="text-white hover:text-gray-400">
            Appointments
          </Link>
        </li>
        <li>
          <Link href="/clinic/patients" className="text-white hover:text-gray-400">
            Patients
          </Link>
        </li>
        <li>
          <Link href="/clinic/Doctors" className="text-white hover:text-gray-400">
          Doctors
          </Link>
        </li>
        <li>
          <Link href="/clinic/clinic-info" className="text-white hover:text-gray-400">
            Info
          </Link>
        </li>
        <li>
          <Link href="/clinic/settings" className="text-white hover:text-gray-400">
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
