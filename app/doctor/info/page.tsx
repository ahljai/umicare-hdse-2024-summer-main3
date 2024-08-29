// locate: app/doctor/info/page.tsx
import { kv } from '@vercel/kv';
import { cookies } from 'next/headers';

interface User {
  userId: string;
  name: string;
  userType: string;
  email: string;
  phone: string;
  clinic?: string;
}

const DoctorInfoPage = async () => {
  const cookieStore = cookies();
  const userCookie = cookieStore.get('user');

  if (!userCookie) {
    return <p>User is not logged in</p>;
  }

  const { userId } = JSON.parse(userCookie.value);

  try {
    const user = await kv.get<User>(userId);

    if (!user) {
      return <p>User not found</p>;
    }

    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 to-gray-300">
        <div className="bg-white flex flex-col max-w-4xl mx-auto space-y-6 p-8 rounded-lg shadow-lg">
          <header className="bg-white shadow-md p-4 mb-12 text-center rounded-lg">
            <h1 className="text-3xl font-semibold text-gray-800">Doctor Info Page</h1>
          </header>
          <div className="space-y-6">
            <div className="flex justify-between text-lg">
              <strong>ID:</strong>
              <span>{user.userId}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg">
              <strong>Name:</strong>
              <span>{user.name}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg">
              <strong>User Type:</strong>
              <span>{user.userType}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg">
              <strong>Email:</strong>
              <span>{user.email}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg">
              <strong>Phone:</strong>
              <span>{user.phone}</span>
            </div>
            {user.clinic && (
              <>
                <hr />
                <div className="flex justify-between text-lg">
                  <strong>Clinic ID:</strong>
                  <span>{user.clinic}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user data:', error);
    return <p>Failed to load user information.</p>;
  }
};

export default DoctorInfoPage;